import praw
import json
import urllib.request
import re
from urllib.parse import urlparse
import config
from util_url import extract_outfit_urls_from_comment, is_imgur_url, is_dressed_so_url, is_reddit_url, create_imgur_url_info, extract_image_urls_from_imgur_url

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
        # We only care about comments that have outfit URLs in them and are not deleted by users. All others (such as a comment with no links), we ignore.
        if not len(create_outfit_urls(top_level_comment.body)) < 1:
                comments.append(create_comment_dictionary(top_level_comment))
    
    return comments

def create_outfit_urls(comment: str) -> list:
    '''
    Given a comment, constructs a list of each Imgur or Dressed.so URL from a comment ending in .jpg, .png, or .jpeg.
    Returns a list of outfit URLs.
    '''
    
    outfit_urls = []

    # Extract all of the image links from the given comment.
    # We call it raw because some Imgur URLs may have multiple images (e.g. albums, galleries), so we need to explode those URLs.
    raw_outfit_urls = extract_outfit_urls_from_comment(comment)

    # Analyze each outfit URL and process accordingly.
    for raw_outfit_url in raw_outfit_urls:
        parsed_raw_outfit_url = urlparse(raw_outfit_url)
        if is_imgur_url(raw_outfit_url):
            # Determine what type of Imgur URL it is, and the hash of said Imgur URL.
            imgur_url_info = create_imgur_url_info(raw_outfit_url)
            imgur_url_type = imgur_url_info['url_type']
            imgur_hash = imgur_url_info['imgur_hash']
            
            # Album or gallery, so we need to extract each image from the album or gallery.
            if imgur_url_type != 'single_image' and imgur_url_type != 'ERROR':
                outfit_urls += extract_image_urls_from_imgur_url(raw_outfit_url, imgur_hash, imgur_url_type)
            elif imgur_url_type == 'image':
                # If it's a single image (ending in .jpg, .jpeg, or .png) or an Imgur image, we can just use the hash.
                # But only append if image is still valid.
                # We call extract_image_urls_from_imgur_url because that'll query the API. Doing so will determine if the image is still alive.
                # If it isn't, it'll just append an empty list. Else, it'll append the outfit URL.
                outfit_urls += extract_image_urls_from_imgur_url(raw_outfit_url, imgur_hash, imgur_url_type)
            else:
                # Invalid URL.
                print(F"Invalid Imgur URL: {raw_outfit_url}")
        elif is_dressed_so_url(raw_outfit_url):
            # Dressed.so URL. We use an else statement because we already filter in the extract_outfit_urls_from_comment function.
            if raw_outfit_url.startswith('http://dressed.so'):
                outfit_hash = parsed_raw_outfit_url.path.split('/')[3]
                outfit_urls.append(F'http://cdn.dressed.so/i/{outfit_hash}.png')
            elif raw_outfit_url.startswith('http://cdn.dressed.so'):
                # Outfit URL starts with cdn.dressed.so, so we can add the URL as is, as it links directly to an image.
                outfit_urls.append(raw_outfit_url)
            else:
                print("Invalid Dressed.so URL.")
        elif is_reddit_url(raw_outfit_url):
            # i.redd.it URL. We can add the URL as is, as it links directly to an image.
            outfit_urls.append(raw_outfit_url)
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

    comment = {
        'author_name': comment.author.name if comment.author is not None else '[deleted]',
        'body': comment.body,
        'comment_id': comment.id,
        'comment_permalink': comment.permalink,
        'comment_score': comment.score,
        'outfits': create_outfit_urls(comment.body),
        'subreddit': comment.subreddit.display_name,
        'subreddit_id': comment.subreddit_id,
        'thread_id': comment.submission.id,
        'timestamp': comment.created_utc
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
    
    thread = {
        'num_top_level_comments': thread_submission.num_comments,
        'subreddit': thread_submission.subreddit.display_name,
        'subreddit_id': thread_submission.subreddit_id,
        'thread_id': thread_submission.id,
        'thread_title': thread_submission.title,
        'thread_score': thread_submission.score,
        'thread_permalink': thread_submission.permalink,
        'timestamp': thread_submission.created_utc
    }

    return thread