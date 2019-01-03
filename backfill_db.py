from util_reddit import generate_comments_from_thread, create_thread_dictionary
import psycopg2
import urllib.request
import json
import praw
import config

def generate_thread_ids(query: str, author_name: str, subreddit: str, size: int = 25) -> set:
    '''
    JSON reading adapted from: https://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
    Produces thread IDs for a given query with a specified author on a given subreddit, with a given size (default 25)
    Uses the Pushshift API to easily retrieve thread data.
    Returns a set of thread IDs.
    NOTE: Use authors of AutoModerator and MFAModerator for MFA.
    '''

    thread_ids = set()
    # Query API for historical thread data.
    with urllib.request.urlopen(F"https://api.pushshift.io/reddit/search/submission/?q={query}&author={author_name}&subreddit={subreddit}&size={size}") as url:
        thread_data = json.loads(url.read().decode())

    # Traverse each thread in the values part of the decoded JSON dictionary and add the ID of each thread to the set.
    # We can't use the thread itself or use the Pushshift API to analyze comments because they are not updated as often (but worth exploring in the future for updating purposes).
    for threads in thread_data.values():
        for thread_data in threads:
            thread_ids.add(thread_data['id'])
            
    return thread_ids

def update_thread(thread_id: str):
    '''
    Given a thread ID, checks if any comments have changed or any new comments are added.
    Check if the date posted of the thread is less than two weeks old, comparing against the current date.
    Called once the database is backfilled.
    '''

    reddit = praw.Reddit(
        user_agent = 'Comment Extraction',
        client_id = config.reddit_client_id,
        client_secret = config.reddit_client_secret
    )

    # Obtain a CommentForest object.
    thread_submission = reddit.submission(id=thread_id)

    # In the event there are "load more comments" or "continue this thread, we replace those with the comments they are hiding.
    thread_submission.comments.replace_more(limit=None)

def select_threads_for_updates(cur):
    '''
    Selects all threads that are less than two weeks old, and calls update_thread on each one to check for new scores and edits to comments.
    '''

    select_threads = """
        SELECT *
        FROM thread
        WHERE timestamp < NOW() - INTERVAL '14 days'
    """

    cur.execute(select_threads)

    for record in cur:
        update_thread(record)
    

def process_thread(thread_id: str):
    '''
    Given a thread ID, retrieves all of the top-level comments and processes them.
    '''

    # Create the statement for inserting thread information into the thread table.
    # We use named parameters because psycopg2 uses a dictionary to map named parameters to values in PostgreSQL.
    # It is also worth noting that even if a dictionary has extra keys, psycopg2 will simply ignore those and look only for the named parameters.
    insert_thread = """
        INSERT INTO thread (num_top_level_comments, subreddit, subreddit_id, thread_id, thread_title, thread_score, thread_permalink, timestamp)
        VALUES(%(num_top_level_comments)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(thread_title)s, %(thread_score)s, %(thread_permalink)s, %(timestamp)s);
    """

    # Create the statement for inserting comment information into the comment table.
    insert_comment = """
        INSERT INTO comment (author_name, body, comment_id, comment_permalink, comment_score, subreddit, subreddit_id, thread_id, timestamp)
        VALUES(%(author_name)s, %(body)s, %(comment_id)s, %(comment_permalink)s, %(comment_score)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(timestamp)s);
    """

    # Create the statement for inserting outfit information into the outfit table.
    insert_outfit = """
        INSERT INTO outfit (author_name, comment_id, outfit_url, thread_id, timestamp)
        VALUES(%s, %s, %s, %s, %s);
    """

    # Create the statement for inserting author information into the author table.
    insert_author = """
        INSERT INTO author (aggregate_score, author_name, average_score, num_comments)
        VALUES(%s, %s, %s, %s);
    """

    # Create the statement for updating author information in the author table.
    update_author = """
        UPDATE author
        SET aggregate_score = aggregate_score + %s,
            average_score = average_score / num_comments,
            num_comments = num_comments + 1
        WHERE author = %s
    """

    # Create the statement for updating the subreddit information in the subreddit table.
    update_subreddit = """
        UPDATE subreddit
        SET num_threads = num_threads + 1
        WHERE subreddit = %s
    """

    # Create the statement for checking if an entry exists.
    thread_exists_query = """
        SELECT EXISTS (
            SELECT 1
            FROM thread
            WHERE thread_id = %s
        )
    """

    # Create the statement for checking if an entry exists.
    author_exists_query = """
        SELECT EXISTS (
            SELECT 1
            FROM author
            WHERE author_name = %s
        )
    """

    # Generate comments and thread information.
    comments = generate_comments_from_thread(thread_id)
    thread_information = create_thread_dictionary(thread_id)

    # Connect to the database.
    conn = psycopg2.connect("dbname=reddit_outfits user=redditoutfits")

    # Open a cursor to perform database operations that has the added functionality of checking if a row exists.
    cur = conn.cursor()

    # Check if we have already processed the thread.
    cur.execute(thread_exists_query, (thread_id,))
    processed_thread = cur.fetchone()[0]

    # If we have already processed the thread, we simply move onto the next thread or ignore the current thread_id.
    if processed_thread:
        return

    # Update the subreddit information as we are processing a new thread.
    cur.execute(update_subreddit, (thread_information['subreddit'],))
    conn.commit()

    # Add thread information.
    cur.execute(insert_thread, thread_information)
    conn.commit()

    # Add relevant information from each comment into respective tables.
    # Start with the table that does not have any foreign keys (i.e. top-down) when adding information.
    # The order is subreddit, thread, author, comment, outfit.
    for comment in comments:
        # Check if author exists.
        cur.execute(author_exists_query, (comment['author_name'],))
        author_exists = cur.fetchone()[0]
        
        if author_exists:
            # Author exists, update information based on current comment.
            cur.execute(update_author, (comment['aggregate_score'], comment['author_name'],))
            conn.commit()
        else:
            # Author does not exist, add new entry.
            cur.execute(insert_author, (comment['comment_score'], comment['author_name'], comment['comment_score'], 1,))
            conn.commit()

        # Add comment information.
        cur.execute(insert_comment, comment)
        conn.commit()

        # Add each outfit that the user posted into the outfit table.
        for outfit in comment['outfits']:
            # Add outfit.
            cur.execute(insert_outfit, (comment['author_name'], comment['comment_id'], outfit, comment['thread_id'], comment['timestamp'],))
            conn.commit()

    cur.close()
    conn.close()