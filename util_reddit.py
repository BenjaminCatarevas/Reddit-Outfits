import praw
import json
import urllib.request
from urllib.parse import urlparse
import config

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