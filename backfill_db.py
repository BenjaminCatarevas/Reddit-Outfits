from util_reddit import generate_historical_thread_ids, generate_comments_from_thread, create_thread_dictionary
import psycopg2

def update_thread(thread_id: str):
    '''
    Given a thread ID, checks if any comments have changed or any new comments are added.
    Called once the database is backfilled.
    '''
    pass

def generate_new_thread_ids() -> list:
    '''
    Generates thread IDs that have not been processed using PRAW search functionality.
    Checks against thread table to see if thread has been processed.
    Called once the database is backfilled.
    '''
    pass

def process_thread(thread_id: str):
    '''
    Given a thread ID, retrieves all of the top-level comments and processes them.
    '''

    # Create the statement for inserting thread information into the thread table.
    # We use named parameters because psycopg2 uses a dictionary to map named parameters to values in PostgreSQL.
    # It is also worth noting that even if a dictionary has extra keys, psycopg2 will simply ignore those and look only for the named parameters.
    insert_thread = """
        INSERT INTO thread (date_posted, num_top_level_comments, subreddit, subreddit_id, thread_id, thread_title, thread_score, thread_permalink, time_posted)
        VALUES(%(date_posted)s, %(num_top_level_comments)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(thread_title)s, %(thread_score)s, %(thread_permalink)s, %(time_posted)s);
    """

    # Create the statement for inserting comment information into the comment table.
    insert_comment = """
        INSERT INTO comment (author_name, body, comment_id, comment_permalink, comment_score, date_posted, subreddit, subreddit_id, thread_id, time_posted)
        VALUES(%(author_name)s, %(body)s, %(comment_id)s, %(comment_permalink)s, %(comment_score)s, %(date_posted)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(time_posted)s);
    """

    # Create the statement for inserting outfit information into the outfit table.
    insert_outfit = """
        INSERT INTO outfit (author_name, comment_id, outfit_url, thread_id)
        VALUES(%s, %s, %s, %s);
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
            cur.execute(insert_outfit, (comment['author_name'], comment['comment_id'], outfit, comment['thread_id'],))
            conn.commit()

    cur.close()
    conn.close()