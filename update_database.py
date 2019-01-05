import praw

import config
from database import RedditOutfitsDatabase


'''
This script is ran once every hour on all subreddits.
'''

def update_threads(threads: list, database):
    '''
    Given a list of threads, updates each one by calling various functions to the database.
    '''

    reddit = praw.Reddit(
        user_agent = 'Comment Extraction',
        client_id = config.reddit_client_id,
        client_secret = config.reddit_client_secret
    )

    for thread in threads:
        # Obtain a CommentForest object.
        # The element at index 1 is the thread ID of each thread record.
        thread_submission = reddit.submission(id=thread[1])

        # In the event there are "load more comments" or "continue this thread,"" we replace those with the comments they are hiding.
        thread_submission.comments.replace_more(limit=None)

# Establish a connection to the database.
database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits', config.redditoutfits_password)

# Retrieve threads that need to be updated.
malefashionadvice_threads_to_update = database.select_threads_to_update('malefashionadvice')
femalefashionadvice_threads_to_update = database.select_threads_to_update('femalefashionadvice')
streetwear_threads_to_update = database.select_threads_to_update('streetwear')

# Update the threads.
update_threads(malefashionadvice_threads_to_update, database)
update_threads(femalefashionadvice_threads_to_update, database)
update_threads(streetwear_threads_to_update, database)

database.close()