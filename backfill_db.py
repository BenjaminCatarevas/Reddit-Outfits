import urllib.request, json, re, tldextract

def generate_thread_IDs(query: str, author: str, subreddit: str) -> list:
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

def extract_outfit_links(comment: str) -> list:
    '''
    Extracts links from a given comment.
    Splits the comment twice. The function splits the comment once to check for URLs posted in plaintext, and once for URLs posted in Markdown.
    Returns a set of URLs. 
    '''
    # TODO: Find a more efficient way of extracting URLs in plaintext and Markdown.

    outfit_links = set()

    # Extraction of plaintext URLs.
    for token in comment.split(" "):
        if token.startswith('http') or token.startswith('https'):
            outfit_links.add(token)

    # Extraction of Markdown URLs.
    for token in comment.split(']('):
        if (token.startswith('http') or token.startswith('https')) and ')' in token:
            res = token.split(')')
            outfit_links.add(res[0])

    # Santitize URLs for any superfluous punctuation. 
    # Adapted from: https://stackoverflow.com/questions/52118382/removing-special-characters-punctuation-for-the-end-of-a-python-list-of-urls
    outfit_links = [re.sub('[^a-zA-Z0-9]+$','',link) for link in outfit_links]

    # Filter out URLs that are not Imgur or Dressed.so domains.
    outfit_links = list(filter(lambda url: is_outfit_url(url), outfit_links))
    return outfit_links

def is_outfit_url(url: str) -> bool:
    '''
    Determines if a given URL is an Imgur or Dressed.so url using tldextract.
    Returns True if so, False otherwise.
    '''
    parsed_url = tldextract.extract(url)
    domain = parsed_url.domain.lower()
    return domain == 'imgur' or domain == 'dressed'

def generate_comments(thread_id: str) -> list:
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