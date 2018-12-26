import urllib.request, json 

def generate_thread_IDs(query, author, subreddit):
    '''
    JSON reading adapted from: https://stackoverflow.com/questions/12965203/how-to-get-json-from-webpage-into-python-script
    Produces thread IDs for a given query with a specified author on a given subreddit, up to a maximum of 500.
    Uses the Pushshift API to easily retrieve historical thread data.
    Returns an array of thread IDs.
    '''
    thread_ids = []
    with urllib.request.urlopen(F"https://api.pushshift.io/reddit/search/submission/?q={query}&author={author}&subreddit={subreddit}&size=500") as url:
        thread_data = json.loads(url.read().decode())
    for threads in thread_data.values():
        for thread_data in threads:
            thread_ids.append(thread_data['id'])
    return thread_ids

def generate_comments(thread_id):
    '''
    Given a thread ID, uses the Reddit API wrapper (PRAW) to access top-level comments and create Comment objects containing only necessary data.
    Returns an array of Comment objects.
    '''
    pass

def create_database():
    '''
    Creates the necessary databases to store thread information. One-time call.
    '''
    pass