import config
from database import RedditOutfitsDatabase
from util_reddit import generate_thread_ids, generate_thread_information_from_thread
import requests
import json
import config
import time
import schedule
import datetime

'''
This script will be called once and will be used to backfill the database for all subreddits.
'''


def save_threads_to_file(filename: str, thread_ids: list):
    '''
    Helper function to save threads to a given file.
    '''
    with open(filename, 'a+') as f:
        # Move to beginning of file.
        f.seek(0)
        # Get the lines of the file and split them to remove \n.
        lines = f.read().splitlines()
        for thread_id in thread_ids:
            # Check if the thread ID already is there. If so, move on.
            # We don't want to add the same thread multiple times.
            # But if they get added, process_thread will skip it.
            if thread_id in lines:
                continue
            else:
                f.write("%s\n" % thread_id)
    f.close()


def retrieve_threads_from_file(filename: str):
    '''
    Helper function that extracts thread IDs from a given file.
    '''
    thread_ids = []
    with open(filename) as f:
        thread_ids = f.read().splitlines()
    f.close()
    return thread_ids


def can_process_images():
    '''
    Checks if the hourly limit has been reached for the Imgur API.
    '''
    url = 'https://api.imgur.com/3/credits'
    payload = {}
    headers = {
        'Authorization': F'Client-ID {config.imgur_client_id}'
    }
    response = requests.request(
        'GET', url, headers=headers, data=payload, allow_redirects=False)
    client_json = json.loads(response.text)['data']
    return client_json


def insert_threads_into_database(filename: str, database):
    # Get the list of thread IDs to process.
    thread_ids = retrieve_threads_from_file(filename)

    # Go through remaining thread IDs.
    for thread_id in thread_ids:
        # Check with Imgur API to see if we can process the given thread with sufficient requests.
        client_json = can_process_images()

        print('-------------------------')
        print(datetime.datetime.now())
        print('-------------------------')

        print('-------------------------')
        print(F"Current remaining requests: {client_json['UserRemaining']}")
        print('-------------------------')

        # Retrieve the number of top level comments. This serves as the number of requests we have to make to the Imgur API.
        num_top_level_comments = generate_thread_information_from_thread(
            thread_id)['num_top_level_comments']

        print('-------------------------')
        print(F"Number of comments: {num_top_level_comments}")
        print('-------------------------')
        # If we can proceed with sufficient requests:
        if client_json['UserRemaining'] >= num_top_level_comments + 40:
            print('-------------------------')
            print(F"Processing thread ID: {thread_id}")
            print('-------------------------')
            # Remove the thread from the list so we can process it.
            thread_ids.pop(0)
            database.process_thread(thread_id)
        else:
            # We do not have sufficient requests, so determine when to run the script again and save the list of threads to a file.
            time_to_try = time.strftime(
                '%Y-%m-%d %H:%M:%S', time.localtime(int(client_json['UserReset'])))
            print('-------------------------')
            print(F"Has reached limit, try again at: {time_to_try}")
            print('-------------------------')
            save_threads_to_file(filename, thread_ids)
            break


database = RedditOutfitsDatabase(
    'reddit_outfits', 'redditoutfits', config.redditoutfits_password)

# RUN THIS SCRIPT EVERY 10 MINUTES, IT CHECKS IF IT CAN USE MORE IMGUR REQUESTS
# DO THIS FOR EACH SUBREDDIT


def job():
    insert_threads_into_database('mfa_threads.txt', database)


schedule.every(10).minutes.do(job)

while(True):
    schedule.run_pending()
    time.sleep(1)


database.close()
