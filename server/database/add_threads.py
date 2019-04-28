from util_reddit import generate_thread_ids

'''
This script will be run to keep the file populated with any threads that need to be processed.
NOTE: In the future, have a file for completed threads.
'''


def save_threads_to_file(filename: str, thread_ids: list):
    '''
    Helper function to save threads to a given file.
    '''
    with open(filename, 'a+') as f:
        # Move to beginning of file.
        f.seek(0)
        # Get the lines of the file and split them to remove \n.
        lines = f.read().splitlines()
        for thread_id in thread_ids:
            # Check if the thread ID already is there. If so, move on.
            # We don't want to add the same thread multiple times.
            # But if they get added, process_thread will skip it.
            if thread_id in lines:
                continue
            else:
                f.write("%s\n" % thread_id)
    f.close()


def add_threads_to_file(query: str, author: str, subreddit: str, num_threads: int, filename: str):
    '''
    Uses the PushShift API to generate threads and saves the thread IDs to a given filename.
    Takes in the query string, author, subreddit, number of threads, and the file to save the IDs to.
    '''
    # Retrieve the most recent 50 threads.
    specified_thread_ids = generate_thread_ids(
        query, author, subreddit, num_threads)
    # Add them to the file to process.
    save_threads_to_file(filename, specified_thread_ids)


# These functions will create or append to files thread IDs for threads to process.
add_threads_to_file('WAYWT', 'AutoModerator',
                    'malefashionadvice', 500, 'mfa_automoderator_threads.txt')
add_threads_to_file('WAYWT', 'MFAModerator',
                    'malefashionadvice', 500, 'mfa_mfamoderator_threads.txt')
add_threads_to_file('WAYWT', 'AutoModerator',
                    'femalefashionadvice', 500, 'ffa_automoderator_threads.txt')
add_threads_to_file('WDYWT', 'AutoModerator', 'streetwear',
                    500, 'streetwear_threads.txt')
