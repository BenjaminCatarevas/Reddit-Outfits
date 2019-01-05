import psycopg2
from util_reddit import generate_comments_from_thread
from util_reddit import generate_thread_information_from_thread

class RedditOutfitsDatabase:
    
    def __init__(self, dbname: str, user: str, password: str):
        self.conn = psycopg2.connect(dbname=dbname, user=user, password=password)

        self.cur = self.conn.cursor()

    def thread_exists(self, thread_id: str) -> bool:
        '''
        Given a thread ID, determines whether the thread is in the thread table.
        Returns True if so, False otherwise.
        '''

        thread_exists_query = """
            SELECT EXISTS (
                SELECT 1
                FROM thread
                WHERE thread_id = %s
            )
        """

        self.cur.execute(thread_exists_query, (thread_id,))

        return self.cur.fetchone()[0]

    def author_exists(self, author_name: str) -> bool:
        '''
        Given an author's name, determines whether the author is in the author table.
        Returns True if so, False otherwise.
        '''

        author_exists_query = """
            SELECT EXISTS (
                SELECT 1
                FROM author
                WHERE author_name = %s
            )
        """

        self.cur.execute(author_exists_query, (author_name,))

        return self.cur.fetchone()[0]

    def outfit_exists(self, outfit_url: str) -> bool:
        '''
        Given an outfit URL, determines whether the outfit is in the outfit table.
        Returns True if so, False otherwise.
        '''

        outfit_exists_query = """
            SELECT EXISTS (
                SELECT 1
                FROM outfit
                WHERE outfit_url = %s
            )
        """

        self.cur.execute(outfit_exists_query, (outfit_url,))

        return self.cur.fetchone()[0]

    def update_subreddit(self, thread_information: str):
        '''
        Given information about a thread, updates the record of the subreddit of the thread.
        '''

        update_subreddit = """
            UPDATE subreddit
            SET num_threads = num_threads + 1
            WHERE subreddit = %(subreddit)s
        """

        self.cur.execute(update_subreddit, thread_information)
        self.conn.commit()

    def update_author(self, comment: dict):
        '''
        Given information about a comment, updates the record of the author of the comment.
        '''

        update_author = """
            UPDATE author
            SET num_comments = num_comments + 1
            WHERE author = %(author_name)s
        """

        self.cur.execute(update_author, comment)
        self.conn.commit()

    def insert_thread(self, thread_information: dict):
        '''
        Given information about a thread, inserts a new record for the thread.
        '''

        # We use named parameters because psycopg2 uses a dictionary to map named parameters to values in PostgreSQL.
        # It is also worth noting that even if a dictionary has extra keys, psycopg2 will simply ignore those and look only for the named parameters.
        insert_thread = """
            INSERT INTO thread (num_top_level_comments, num_total_comments, subreddit, subreddit_id, thread_id, thread_title, thread_score, thread_permalink, timestamp)
            VALUES(%(num_top_level_comments)s, %(num_total_comments)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(thread_title)s, %(thread_score)s, %(thread_permalink)s, %(timestamp)s);
        """

        self.cur.execute(insert_thread, thread_information)
        self.conn.commit()


    def insert_author(self, comment: dict):
        '''
        Given information about a comment, inserts a new record for the author associated with the comment.
        '''

        # Since it is a new record, the aggregate score and average score are the same, and the author has only posted once.
        insert_author = """
            INSERT INTO author (author_name, num_comments)
            VALUES(%(author_name)s, 1);
        """

        self.cur.execute(insert_author, comment)
        self.conn.commit()

    def insert_comment(self, comment: dict):
        '''
        Given information about a comment, inserts a new record for the comment.
        '''

        insert_comment = """
            INSERT INTO comment (author_name, body, comment_id, comment_permalink, comment_score, subreddit, subreddit_id, thread_id, timestamp)
            VALUES(%(author_name)s, %(body)s, %(comment_id)s, %(comment_permalink)s, %(comment_score)s, %(subreddit)s, %(subreddit_id)s, %(thread_id)s, %(timestamp)s);
        """

        self.cur.execute(insert_comment, comment)
        self.conn.commit()

    def insert_outfit(self, comment: dict, outfit_url: str):
        '''
        Given information about a comment and an outfit URL, inserts a new record for the outfit with relevant information from the comment.
        '''

        insert_outfit = """
            INSERT INTO outfit (author_name, comment_id, outfit_url, thread_id, timestamp)
            VALUES(%s, %s, %s, %s, %s);
        """

        self.cur.execute(insert_outfit, (comment['author_name'], comment['comment_id'], outfit_url, comment['thread_id'], comment['timestamp']))
        self.conn.commit()
    
    def select_threads_to_update(self, subreddit: str) -> list:
        '''
        Selects all threads that are less than two weeks old.
        Query adapted from: https://stackoverflow.com/a/17998598 and https://stackoverflow.com/a/17998488
        Returns a list.
        '''

        select_threads = """
            SELECT *
            FROM thread
            WHERE timestamp > EXTRACT(epoch from NOW() - INTERVAL '14 DAY') AND subreddit = %s
        """

        self.cur.execute(select_threads, (subreddit,))

        # The Cursor object is an iterator, so we can cast it to a list to obtian every value in the iterator.
        return list(self.cur)

    def select_all_outfits(self) -> list:
        '''
        Selects all images from the outfits database.
        Returns a list
        '''

        select_all_outfits_query = """
            SELECT *
            FROM outfits
        """

        self.cur.execute(select_all_outfits_query)

        return list(self.cur)

    def delete_outfit(self, outfit_url: str):
        '''
        Given an outfit's URL, deletes it from the database.
        '''

        delete_outfit_query = """
            DELETE FROM outfit
            WHERE outfit_url = %s
        """

        self.cur.execute(delete_outfit_query, (outfit_url,))

    def process_thread(self, thread_id: str):
        '''
        Given a thread ID, retrieves all of the top-level comments and processes them.
        This function is called for new threads only. 
        '''

        # If the thread exists, we have already processed it, so we do nothing.
        thread_exists = self.thread_exists(thread_id)

        if thread_exists:
            return

        comments = generate_comments_from_thread(thread_id)
        thread_information = generate_thread_information_from_thread(thread_id)

        self.update_subreddit(thread_information)

        self.insert_thread(thread_information)

        # Add relevant information from each comment into respective tables.
        # Start with the table that does not have any foreign keys or constraints(i.e. top-down) when adding information.
        # The order is subreddit, thread, author, comment, outfit.
        for comment in comments:
            author_exists = self.author_exists(comment['author_name'])

            # If the author exists, update their information. Otherwise insert a new entry.
            if author_exists:
                self.update_author(comment)
            else:
                self.insert_author(comment)

            self.insert_comment(comment)

            for outfit in comment['outfits']:
                outfit_exists = self.outfit_exists(outfit)

                # Only insert if the user did not submit a duplicate outfit and/or split an album into individual images.
                if not outfit_exists:
                    self.insert_outfit(comment, outfit)
        
    def close(self):
        '''
        Close the database connection and cursor.
        '''

        self.cur.close()
        self.conn.close()