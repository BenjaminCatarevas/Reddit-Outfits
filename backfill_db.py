from util_reddit import generate_historical_thread_ids, generate_comments_from_thread, create_thread_dictionary
import psycopg2
import psycopg2.extensions

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
        INSERT INTO comment (author, body, comment_id, comment_permalink, date_posted, subreddit, subreddit_id, thread_id, time_posted)
        VALUES(%(author)s, %(body)s, %(comment_id)s, %(comment_permalink)s, %(date_posted)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(time_posted)s);
    """

    return insert_comment

def generate_add_thread() -> str:
    '''
    Constructs a SQL statement to add a thread to the thread table.
    Returns a string.
    '''

    # Create the statement for inserting thread information into the thread table.
    insert_thread = """
        INSERT INTO comment (date_posted, number_of_comments, subreddit, thread_id, thread_title, thread_score, thread_permalink, time_posted)
        VALUES(%(date_posted)s, %(number_of_comments)s, %(subreddit)s, %(thread_id)s, %(thread_title)s, %(thread_score)s, %(thread_permalink)s, %(time_posted)s);
    """

    return insert_thread

def generate_add_author() -> str:
    '''
    Constructs a SQL statement to add an author to the author table.
    '''
    pass

def generate_add_outfit() -> str:
    '''
    Constructs a SQL statement to add an outfit to the outfit table.
    '''

def author_exists(self, author_name: str) -> bool:
    '''
    Given an author's name, determines if it exists in the author table.
    Returns True if so, False otherwise.
    Adapted from: https://stackoverflow.com/a/20449101
    '''
    cur.execute("SELECT * FROM author WHERE author = %s", (author_name,))

def process_thread(thread_id: str):
    '''
    Given a thread ID, retrieves all of the top-level comments and processes them.
    '''

    # Generate comments and thread information.
    comments = generate_comments_from_thread(thread_id)
    thread_information = create_thread_dictionary(thread_id)

    # Connect to the database.
    conn = psycopg2.connect("dbname=reddit_outfits user=redditoufits")

    # Open a cursor to perform database operations.
    cur = conn.cursor()

    # Add relevant information from each comment into respective tables.
    for comment in comments:
        cur.execute(generate_add_comment, comment)