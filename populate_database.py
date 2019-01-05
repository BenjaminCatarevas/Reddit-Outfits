import config
from database import RedditOutfitsDatabase
from util_reddit import generate_thread_ids


'''
This script is ran according to Malefashionadvice's, Femalefashionadvice's, and Streetwear's weekly thread(s) schedules.
'''

def process_threads(thread_ids: list, database):
    '''
    Given a list of threads IDs, processes each one. 
    '''

    for thread_id in thread_ids:
        database.process_thread(thread_id)

database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits', config.redditoutfits_password)

# Retrieve most recent 25 thread IDs for each subreddit.
malefashionadvice_thread_ids = generate_thread_ids('author:AutoModerator WAYWT', 'AutoModerator', 'malefashionadvice')
femalefashionadvice_thread_ids = generate_thread_ids('what are you wearing today flair:weekly', 'AutoModerator', 'femalefashionadvice')
streetwear_thread_ids = generate_thread_ids('WDYWT author:AutoModerator', 'AutoModerator', 'streetwear')

process_threads(malefashionadvice_thread_ids, database)
process_threads(femalefashionadvice_thread_ids, database)
process_threads(streetwear_thread_ids, database)

database.close()