import urllib.request
import json
import re
import requests
import praw
import config
from urllib.parse import urlparse

def generate_thread_IDs(query: str, author: str, subreddit: str) -> set:
    '''
    JSON reading adapted from: https://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
    Produces thread IDs for a given query with a specified author on a given subreddit, up to a maximum of 500.
    Uses the Pushshift API to easily retrieve historical thread data.
    Returns an array of thread IDs.
    '''

    thread_ids = set()
    # Query API for historical thread data.
    with urllib.request.urlopen(F"https://api.pushshift.io/reddit/search/submission/?q={query}&author={author}&subreddit={subreddit}&size=500") as url:
        thread_data = json.loads(url.read().decode())
    # Traverse each thread in the values part of the decoded JSON dictionary and add the ID of each thread to the set.
    for threads in thread_data.values():
        for thread_data in threads:
            thread_ids.add(thread_data['id'])
    return thread_ids

def extract_outfit_urls(comment: str) -> list:
    '''
    Extracts URLs from a given comment.
    Splits the comment twice. The function splits the comment once to check for URLs posted in plaintext, and once for URLs posted in Markdown.
    Returns a set of URLs. 
    NOTE: This assumes that the comment has outfit URLs in plaintext or properly formatted Markdown. Outfit URLs in ill-formatted Markdown will be ignored.
    But, there will be cron jobs or something similar to regularly update threads, and ideally will capture comments that are updated (such as with proper Markdown).
    '''
    # TODO: Find a more efficient way of extracting URLs in plaintext and Markdown.

    outfit_urls = set()

    # Extraction of plaintext URLs.
    for token in comment.split(" "):
        if token.startswith('http') or token.startswith('https'):
            outfit_urls.add(token)

    # Extraction of Markdown URLs.
    for token in comment.split(']('):
        if (token.startswith('http') or token.startswith('https')) and ')' in token:
            res = token.split(')')
            outfit_urls.add(res[0])

    # Santitize URLs for any superfluous punctuation. 
    # Adapted from: https://stackoverflow.com/questions/52118382/removing-special-characters-punctuation-for-the-end-of-a-python-list-of-urls
    outfit_urls = [re.sub('[^a-zA-Z0-9]+$','',URL) for URL in outfit_urls]

    # Filter out URLs that are not Imgur or Dressed.so domains.
    outfit_urls = list(filter(lambda url: is_outfit_url(url), outfit_urls))
    return outfit_urls

def is_outfit_url(url: str) -> bool:
    '''
    Determines if a given URL is an Imgur or Dressed.so url using urlparse.
    Returns True if so, False otherwise.
    '''

    parsed_url = urlparse(url)
    host = parsed_url.netloc.lower()
    return host == 'imgur.com' or host == 'dressed.so' or host == 'cdn.dressed.so' or host == 'i.imgur.com'

def extract_urls_from_imgur(imgur_url: str, url_type: str) -> list:
    '''
    Extracts image URLs from either an Imgur album or gallery, depending on url_type.
    Returns an array of image URLs.
    '''

    image_urls = []

    # Extract the album hash by parsing the URL.
    album_hash = urlparse(imgur_url).path[3:] if url_type == 'album' else urlparse(imgur_url).path[9:]

    url = F'https://api.imgur.com/3/{url_type}/{album_hash}/images'
    payload = {}
    headers = {
        'Authorization': F'Client-ID {config.imgur_client_id}'
    }
    response = requests.request('GET', url, headers = headers, data = payload, allow_redirects=False)
    album_json = json.loads(response.text)['data']

    # Invalid album.
    if 'error' in album_json:
        print(F"Error: {album_json['error']}")
        return []

    # Valid album.
    for image in album_json:
        image_urls.append(image['link'])

    return image_urls

def type_of_imgur_url(imgur_url: str) -> dict:
    '''
    Given an Imgur URL, determines if the URL is an album, gallery, Imgur image, or single image (.png, .jpeg, .jpg)
    Returns a dictionary where the first element is the type of URL, and the second element is the alphanumeric hash (if applicable).
    Type is chosen from {'album', 'gallery', 'imgur_image', {'png', 'jpeg', 'jpg'}}.
    '''
    parsed_url_path = urlparse(imgur_url).path

    # Album.
    if parsed_url_path.startswith('/a/'):
        return {'url_type': 'album', 'image_hash': parsed_url_path[3:]}
    # Gallery.
    elif parsed_url_path.startswith('/gallery/'):
        return {'url_type': 'gallery', 'image_hash': parsed_url_path[9:]}
    # Single image.
    elif parsed_url_path.endswith(('.jpg', '.jpeg', '.png', '.gif', '.gifv')):
        # Regular expression adapted from: https://stackoverflow.com/questions/23259110/python-splitting-a-string-twice
        # Split on / and . to get the alphanumeric hash, and isolate it. When displaying images, we will use one MIME type, namely .png.
        return {'url_type': 'single_image', 'image_hash': re.split(r'[/.]', parsed_url_path)[1]}
    # Imgur image.
    else:
        return {'url_type': 'imgur_image', 'image_hash': parsed_url_path[1:]}


def generate_comments(thread_id: str) -> list:
    '''
    Given a thread ID, uses the Reddit API wrapper (PRAW) to access top-level comments and create comment dictionaries containing only necessary data.
    Returns an array of comment dictionaries.
    Adapted from: https://praw.readthedocs.io/en/latest/tutorials/comments.html
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
        comments.append(create_comment_dictionary(top_level_comment))
    
    return comments

def create_comment_dictionary(comment) -> dict:
    '''
    Given a Comment object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''
    comment = {
        'author': comment.author.name,
        'body': comment.body,
        'comment_id': comment.id,
        'comment_permalink': comment.permalink,
        'comment_score': comment.score,
        'subreddit': comment.subreddit.display_name,
        'subreddit_id': comment.subreddit_id,
        'thread_id': comment.link_id,
        'time_created': comment.created_utc
    }

    return comment

def create_thread_dictionary(submission: str) -> dict:
    '''
    Given a Submission object, creates a dictionary holding only relevant information.
    Returns a dictionary.
    '''
    thread = {
        'number_of_comments': submission.num_comments,
        'subreddit': submission.subreddit.display_name,
        'time_created': submission.created_utc,
        'thread_id': submission.id,
        'thread_title': submission.title,
        'thread_score': submission.score,
        'thread_permalink': submission.permalink,
    }

    return thread

def create_database():
    '''
    Creates the necessary databases to store thread information. One-time call.
    '''
    pass