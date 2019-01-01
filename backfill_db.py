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

def generate_add_comment() -> str:
    '''
    Constructs a SQL statement to add a comment to the comment table.
    Returns a string.
    '''

    # Create the statement for inserting comment information into the comment table.
    insert_comment = """
        INSERT INTO comment (author_name, body, comment_id, comment_permalink, date_posted, subreddit, subreddit_id, thread_id, time_posted)
        VALUES(%(author_name)s, %(body)s, %(comment_id)s, %(comment_permalink)s, %(date_posted)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(time_posted)s);
    """

    return insert_comment

def generate_add_thread() -> str:
    '''
    Constructs a SQL statement to add a thread to the thread table.
    Returns a string.
    '''

    # Create the statement for inserting thread information into the thread table.
    insert_thread = """
        INSERT INTO thread (date_posted, number_of_comments, subreddit, thread_id, thread_title, thread_score, thread_permalink, time_posted)
        VALUES(%(date_posted)s, %(number_of_comments)s, %(subreddit)s, %(thread_id)s, %(thread_title)s, %(thread_score)s, %(thread_permalink)s, %(time_posted)s);
    """

    return insert_thread

def process_thread(thread_id: str):
    '''
    Given a thread ID, retrieves all of the top-level comments and processes them.
    '''

    # Generate comments and thread information.
    comments = generate_comments_from_thread(thread_id)
    thread_information = create_thread_dictionary(thread_id)

    # Connect to the database.
    conn = psycopg2.connect("dbname=reddit_outfits user=redditoufits")

    # Open a cursor to perform database operations that has the added functionality of checking if a row exists.
    cur = conn.cursor()

    # Add thread information.
    cur.execute(generate_add_thread(), thread_information)

    # Add relevant information from each comment into respective tables.
    for comment in comments:
        cur.execute(generate_add_comment(), comment)

        # Add each outfit that the user posted into the outfit table.
        for outfit in comment.outfits:
            # Add outfit.
            cur.execute("""
                INSERT INTO outfit (author_name, comment_id, outfit_url, thread_id)
                VALUES(%s, %s, %s, %s);
            """,
            (comment['author_name'], comment['comment_id'], outfit, comment['thread_id']))

        # Check if author exists.
        cur.execute("SELECT * FROM author WHERE author_name = %s", (comment['author_name'],))
        author_exists = cur.fetchone() is not None
        
        if author_exists:
            # Author exists, update information based on current comment.
            cur.execute("""
                UPDATE author
                SET aggregate_score = aggregate_score + %s,
                    average_score = average_score / num_comments,
                    num_comments = num_comments + 1
                WHERE author = %s
            """,
            (comment['aggregate_score'], comment['author_name']))
        else:
            # Author does not exist, add new entry.
            cur.execute("""
                INSERT INTO author (aggregate_score, author_name, average_score, num_comments)
                VALUES(%s, %s, %s, %s);
            """,
            (0, comment['author_name'], 0, 1))