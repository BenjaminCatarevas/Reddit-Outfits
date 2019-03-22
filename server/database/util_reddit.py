import json
import re
import urllib.request
from urllib.parse import urlparse
import praw
import config
from util_url import extract_image_urls_from_imgur_url
from util_url import extract_outfit_urls_from_comment_body
from util_url import generate_imgur_url_info
from util_url import is_dressed_so_url
from util_url import is_imgur_url
from util_url import is_reddit_url


def generate_thread_ids(query: str, author_name: str, subreddit: str, size: int = 25) -> set:
    '''
    JSON reading adapted from: https://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
    Produces thread IDs for a given query with a specified author on a given subreddit, with a given size (default 25)
    Uses the Pushshift API to easily retrieve thread data.
    Returns a set of thread IDs.
    '''

    thread_ids = set()

    # Query API for historical thread data.
    with urllib.request.urlopen(F"https://api.pushshift.io/reddit/search/submission/?title={query}&author={author_name}&subreddit={subreddit}&size={size}") as url:
        thread_data = json.loads(url.read().decode())

    # Traverse each thread in the values part of the decoded JSON dictionary and add the ID of each thread to the set.
    # We can't use the thread itself or use the Pushshift API to analyze comments because they are not updated as often (but worth exploring in the future for updating purposes).
    for threads in thread_data.values():
        for thread_data in threads:
            thread_ids.add(thread_data['id'])

    return thread_ids


def generate_comments_from_thread(thread_id: str) -> list:
    '''
    Adapted from: https://praw.readthedocs.io/en/latest/tutorials/comments.html
    Given a thread ID, uses the Reddit API wrapper (PRAW) to access top-level comments and create comment dictionaries containing only necessary data.
    Returns an array of comment dictionaries.
    '''

    comments = []
    reddit = praw.Reddit(
        user_agent='Comment Extraction',
        client_id=config.reddit_client_id,
        client_secret=config.reddit_client_secret
    )

    # Obtain a CommentForest object.
    thread_submission = reddit.submission(id=thread_id)

    # In the event there are "load more comments" or "continue this thread," we replace those with the comments they are hiding.
    thread_submission.comments.replace_more(limit=None)

    # Traverse all of the comments.
    for top_level_comment in thread_submission.comments:
        outfits_from_comment = create_outfit_urls(top_level_comment.body)
        # We only care about comments that have outfit URLs in them. All others (such as a comment with no links), we ignore.
        if len(outfits_from_comment) >= 1:
            comments.append(create_comment_dictionary(
                top_level_comment, outfits_from_comment))

    return comments


def create_outfit_urls(comment_body: str) -> set:
    '''
    Given the body of a comment, constructs a list of each Imgur or Dressed.so URL from the body of a comment ending in .jpg, .png, or .jpeg.
    Returns a list of outfit URLs.
    '''

    outfit_urls = []

    # Extract all of the image links from the given comment.
    # We call it raw because some Imgur URLs may have multiple images (e.g. albums, galleries), so we need to explode those URLs.
    raw_outfit_urls = extract_outfit_urls_from_comment_body(comment_body)

    for raw_outfit_url in raw_outfit_urls:
        parsed_raw_outfit_url = urlparse(raw_outfit_url)

        if is_imgur_url(raw_outfit_url):
            # Determine what type of Imgur URL it is, and the hash of said Imgur URL.
            imgur_url_info = generate_imgur_url_info(raw_outfit_url)
            imgur_url_type = imgur_url_info['url_type']
            imgur_hash = imgur_url_info['imgur_hash']

            # Not a valid URL, so just return an empty list.
            if imgur_url_type == 'ERROR':
                print(F"Invalid Imgur URL: {raw_outfit_url}")
                return []
            else:
                # Process the Imgur URL no matter the type.
                outfit_urls += extract_image_urls_from_imgur_url(
                    raw_outfit_url, imgur_hash, imgur_url_type)

        elif is_dressed_so_url(raw_outfit_url):
            if raw_outfit_url.startswith('http://dressed.so'):
                # Parse the URL for the hash of the image before adding to the list.
                outfit_hash = parsed_raw_outfit_url.path.split('/')[3]
                outfit_urls.append(
                    F'http://cdn.dressed.so/i/{outfit_hash}l.png')
            elif raw_outfit_url.startswith('http://cdn.dressed.so'):
                # Outfit URL starts with cdn.dressed.so, so we can add the URL as is, as it links directly to an image.
                outfit_urls.append(raw_outfit_url)
            else:
                print(F"Invalid Dressed.so URL: {raw_outfit_url}")
        elif is_reddit_url(raw_outfit_url):
            # i.redd.it URL. We can add the URL as is, as it links directly to an image.
            outfit_urls.append(raw_outfit_url)
        else:
            # Invalid outfit URL.
            print(F"Invalid outfit URL: {raw_outfit_url}")
            continue

    # We cast the list into a set to avoid duplicates.
    return set(outfit_urls)


def create_comment_dictionary(comment, outfits_from_comment: set) -> dict:
    '''
    Given a Comment object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''

    comment = {
        'author_name': comment.author.name if comment.author is not None else '[deleted]',
        'body': comment.body,
        'comment_id': comment.id,
        'comment_permalink': 'https://reddit.com' + comment.permalink,
        'comment_score': comment.score,
        'outfits': outfits_from_comment,
        'subreddit': comment.subreddit.display_name.lower(),
        'subreddit_id': comment.subreddit_id,
        'thread_id': comment.submission.id,
        'comment_timestamp': comment.created_utc
    }

    return comment


def generate_thread_information_from_thread(thread_id: str) -> dict:
    '''
    Given a Submission object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''

    # NOTE: We use the reddit API as opposed to the pushshift API because it's easier to track scoring.
    # Pushshift updates its records only so often, whereas pinging the reddit API gets us new information right away.
    reddit = praw.Reddit(
        user_agent='Thread Information Extraction',
        client_id=config.reddit_client_id,
        client_secret=config.reddit_client_secret
    )

    thread_submission = reddit.submission(id=thread_id)

    thread = {
        'num_top_level_comments': len(thread_submission.comments),
        'num_total_comments': thread_submission.num_comments,
        'subreddit': thread_submission.subreddit.display_name,
        'subreddit_id': thread_submission.subreddit_id,
        'thread_id': thread_submission.id,
        'thread_title': thread_submission.title,
        'thread_score': thread_submission.score,
        'thread_permalink': 'https://reddit.com' + thread_submission.permalink,
        'thread_timestamp': thread_submission.created_utc
    }

    return thread
