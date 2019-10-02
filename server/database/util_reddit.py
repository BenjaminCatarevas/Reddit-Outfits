import json
import re
import urllib.request
import requests
import json
from urllib.parse import urlparse
import praw
import config
from util_url import extract_image_urls_from_imgur_url
from util_url import extract_outfit_urls_from_comment_body
from util_url import generate_imgur_url_info
from util_url import is_dressed_so_url
from util_url import is_imgur_url
from util_url import is_reddit_url
from util_url import is_twimg_url
from util_url import is_ibbco_url
from util_url import is_cdninstagram_url
from util_url import is_cdndiscordapp_url
from util_url import is_nsa40casimages_url


def generate_thread_ids(query: str, subreddit: str, size: int = 25, author_name: str = '', before: int = '') -> set:
    '''
    JSON reading adapted from: https://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
    Produces thread IDs for a given query with a specified author on a given subreddit, with a given size (default 25)
    Uses the Pushshift API to easily retrieve thread data.
    Returns a set of thread IDs.
    '''

    thread_ids = set()

    # Query API for historical thread data.
    url = F"https://api.pushshift.io/reddit/search/submission/?title={query}&author={author_name}&subreddit={subreddit}&size={size}&before={before}"
    r = requests.get(url=url)
    thread_data = r.json()

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
        # If we hit an empty comment or a comment whose account has been deleted, move on.
        if top_level_comment is None or top_level_comment.author is None:
            continue

        outfits_from_comment = create_outfit_urls(
            top_level_comment.body, top_level_comment.permalink)
        # We only care about comments that have outfit URLs in them. All others (such as a comment with no links), we ignore.
        if len(outfits_from_comment) >= 1:
            comments.append(create_comment_dictionary(
                top_level_comment, outfits_from_comment))

    return comments


def create_outfit_urls(comment_body: str, permalink: str) -> set:
    '''
    Given the body of a comment, constructs a list of each Imgur or Dressed.so URL from the body of a comment ending in .jpg, .png, or .jpeg.
    Also takes in permalink for error purposes.
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
            # NOTE: We split on ampersand because anything after an ampersand in an Imgur has is not necessary.
            imgur_hash = imgur_url_info['imgur_hash'].split('&')[0]

            # Not a valid URL, so just return an empty list.
            if imgur_url_type == 'ERROR':
                print('-------------------------')
                print(F"Invalid Imgur URL: {raw_outfit_url}")
                print(F'Permalink: https://reddit.com{permalink}')
                print('-------------------------')
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
                print('-------------------------')
                print(F"Invalid Dressed.so URL: {raw_outfit_url}")
                print(F'Permalink: https://reddit.com{permalink}')
                print('-------------------------')
        elif is_reddit_url(raw_outfit_url):
            # i.redd.it URL. We can add the URL as is, as it links directly to an image.
            outfit_urls.append(raw_outfit_url)
        elif is_twimg_url(raw_outfit_url):
            # pbs.twimg URL. It links directly to an image, so we can add it.
            outfit_urls.append(raw_outfit_url)
        elif is_ibbco_url(raw_outfit_url):
            # i.ibb.co URL, links directly to an image, so we can add it.
            outfit_urls.append(raw_outfit_url)
        elif is_cdninstagram_url(raw_outfit_url):
            # cdninstagram.com URL, links directly to an image, so we can add it.
            outfit_urls.append(raw_outfit_url)
        elif is_cdndiscordapp_url(raw_outfit_url):
            # cdndiscordapp.com URL, links directly to an image, so we can add it.
            outfit_urls.append(raw_outfit_url)
        elif is_nsa40casimages_url(raw_outfit_url):
            # Auxiliary check to ensure it's an image
            # We check the last four characters to chekc if it's a JPG or PNG.
            # Since this URL does not start with cdn, a user could mislink their outfit with the base URL instead.
            if raw_outfit_url[-4:] == '.jpg' or raw_outfit_url[-4:] == '.png':
                # nsa40.casimages.com URL, links directly to an image, so we can add it.
                outfit_urls.append(raw_outfit_url)
        else:
            # Invalid outfit URL.
            print('-------------------------')
            print(F"Invalid outfit URL: {raw_outfit_url}")
            print(F'Permalink: https://reddit.com{permalink}')
            print('-------------------------')
            continue

    # We cast the list into a set to avoid duplicates.
    return set(outfit_urls)


def create_comment_dictionary(comment, outfits_from_comment: set) -> dict:
    '''
    Given a Comment object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''

    comment = {
        'author_name': comment.author.name if comment.author else '[deleted]',
        'body': comment.body,
        'comment_id': comment.id,
        'comment_permalink': F'https://reddit.com{comment.permalink}',
        'comment_score': comment.score,
        'outfits': outfits_from_comment,
        'subreddit': comment.subreddit.display_name.lower(),
        'subreddit_id': comment.subreddit_id,
        'thread_id': comment.submission.id,
        'comment_timestamp': comment.created_utc,
        'num_outfits': len(outfits_from_comment)
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
