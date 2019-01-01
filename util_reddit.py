import praw
import json
import urllib.request
import re
from urllib.parse import urlparse
import config
from util_url import extract_outfit_urls_from_comment, is_imgur_url, is_dressed_so_url, is_reddit_url, create_imgur_url_info, extract_image_urls_from_imgur_url
from datetime import datetime

def generate_historical_thread_ids(query: str, author_name: str, subreddit: str) -> set:
    '''
    JSON reading adapted from: https://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
    Produces thread IDs for a given query with a specified author on a given subreddit, up to a maximum of 500.
    Uses the Pushshift API to easily retrieve historical thread data.
    Returns a set of thread IDs.
    '''

    historical_thread_ids = set()
    # Query API for historical thread data.
    with urllib.request.urlopen(F"https://api.pushshift.io/reddit/search/submission/?q={query}&author={author_name}&subreddit={subreddit}&size=500") as url:
        thread_data = json.loads(url.read().decode())

    # Traverse each thread in the values part of the decoded JSON dictionary and add the ID of each thread to the set.
    for threads in thread_data.values():
        for thread_data in threads:
            historical_thread_ids.add(thread_data['id'])
            
    return historical_thread_ids

def generate_comments_from_thread(thread_id: str) -> list:
    '''
    Adapted from: https://praw.readthedocs.io/en/latest/tutorials/comments.html
    Given a thread ID, uses the Reddit API wrapper (PRAW) to access top-level comments and create comment dictionaries containing only necessary data.
    Returns an array of comment dictionaries.
    '''

    comments = []
    reddit = praw.Reddit(
        user_agent = 'Comment Extraction',
        client_id = config.reddit_client_id,
        client_secret = config.reddit_client_secret
    )

    # Obtain a CommentForest object.
    thread_submission = reddit.submission(id=thread_id)

    # In the event there are "load more comments" or "contine this thread, we replace those with the comments they are hiding.
    thread_submission.comments.replace_more(limit=None)

    # Traverse all of the comments.
    for top_level_comment in thread_submission.comments:
        # We only care about comments that have outfit URLs in them. All others, we ignore.
        if len(create_outfit_urls(top_level_comment.body)) < 1:
            continue
        else:
            comments.append(create_comment_dictionary(top_level_comment))
    
    return comments

def create_outfit_urls(comment: str) -> list:
    '''
    Given a comment, constructs a list of each Imgur or Dressed.so URL in single-image format (i.e. in .png format)
    Returns a list of outfit URLs ending in .png
    '''
    
    outfit_urls = []

    # Raw because some Imgur URLs may have multiple images (e.g. albums, galleries), so we need to explode those URLs.
    raw_outfit_urls = extract_outfit_urls_from_comment(comment)

    for outfit_url in raw_outfit_urls:
        if is_imgur_url(outfit_url):
            # Determine what type of Imgur URL it is, and the hash of said Imgur URL.
            imgur_url_info = create_imgur_url_info(outfit_url)
            imgur_url_type = imgur_url_info['url_type']
            imgur_hash = imgur_url_info['imgur_hash']
            
            if imgur_url_type != 'single_image' and imgur_url_type != 'ERROR':
                # If it's an album or gallery, we need to explode the images in the URL.
                outfit_urls += extract_image_urls_from_imgur_url(outfit_url, imgur_hash, imgur_url_type)
            elif imgur_url_type == 'single_image':
                # If it's a single image (ending in .jpg, .jpeg, or .png), we can just use the hash.
                outfit_urls.append(F'https://i.imgur.com/{imgur_hash}.png')
            else:
                # Invalid URL.
                print("Invalid Imgur URL.")
        elif is_dressed_so_url(outfit_url):
            # Dressed.so URL. We use an else statement because we already filter in the extract_outfit_urls_from_comment function.
            if outfit_url.startswith('http://dressed.so'):
                parsed_outfit_url = urlparse(outfit_url)
                outfit_hash = parsed_outfit_url.path.split('/')[3]
                outfit_urls.append(F'http://cdn.dressed.so/i/{outfit_hash}.png')
            elif outfit_url.startswith('http://cdn.dressed.so'):
                # Outfit URL starts with cdn.dressed.so, so we can add the URL as is, as it links directly to an image.
                outfit_urls.append(outfit_url)
            else:
                print("Invalid Dressed.so URL.")
        elif is_reddit_url(outfit_url):
            # i.redd.it URL. We can add the URL as is, as it links directly to an image.
            outfit_urls.append(outfit_url)
        else:
            # Invalid outfit URL.
            print("Invalid outfit URL.")
            continue
                
    return outfit_urls

def create_comment_dictionary(comment) -> dict:
    '''
    Given a Comment object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''

    # Convert the Unix Time timestamp from the Comment object into the date posted and time posted.
    date_posted, time_posted = datetime.utcfromtimestamp(comment.created_utc).strftime('%Y-%m-%d %H:%M:%S').split(' ')

    comment = {
        'author_name': comment.author.name,
        'body': comment.body,
        'comment_id': comment.id,
        'comment_permalink': comment.permalink,
        'comment_score': comment.score,
        'date_posted': date_posted,
        'outfits': create_outfit_urls(comment.body),
        'subreddit': comment.subreddit.display_name,
        'subreddit_id': comment.subreddit_id,
        'thread_id': comment.submission.id,
        'time_posted': time_posted
    }

    return comment

def create_thread_dictionary(thread_id: str) -> dict:
    '''
    Given a Submission object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''

    reddit = praw.Reddit(
        user_agent = 'Thread Information Extraction',
        client_id = config.reddit_client_id,
        client_secret = config.reddit_client_secret
    )

    thread_submission = reddit.submission(id=thread_id)

    # Convert the Unix Time timestamp from the Submission object into the date posted and time posted.
    date_posted, time_posted = datetime.utcfromtimestamp(thread_submission.created_utc).strftime('%Y-%m-%d %H:%M:%S').split(' ')
    
    thread = {
        'date_posted': date_posted,
        'num_top_level_comments': thread_submission.num_comments,
        'subreddit': thread_submission.subreddit.display_name,
        'subreddit_id': thread_submission.subreddit_id,
        'thread_id': thread_submission.id,
        'thread_title': thread_submission.title,
        'thread_score': thread_submission.score,
        'thread_permalink': thread_submission.permalink,
        'time_posted': time_posted
    }

    return thread