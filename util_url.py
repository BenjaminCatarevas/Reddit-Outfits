from urllib.parse import urlparse
import config
import json
import re
import requests

def is_imgur_url(url: str) -> bool:
    '''
    Determines if a given URL is an Imgur URL using urlparse.or Dressed.so url using urlparse.
    Returns True if so, False otherwise.
    '''

    parsed_url = urlparse(url)
    host = parsed_url.netloc.lower()
    return host == 'imgur.com' or host == 'i.imgur.com'

def is_dressed_so_url(url: str) -> bool:
    '''
    Determines if a given URL is a Dressed.so URL using urlparse.
    Returns True if so, False otherwise.
    '''
    
    parsed_url = urlparse(url)
    host = parsed_url.netloc.lower()
    return host == 'dressed.so' or host == 'cdn.dressed.so'

def extract_image_urls_from_imgur_url(imgur_url: str, imgur_hash: str, url_type: str) -> list:
    '''
    Extracts image URLs from either an Imgur album, image, or gallery, depending on url_type.
    Returns a list of image URLs.
    '''

    image_urls = []

    # Construct the API endpoint URL to ping to receive information about the URL.
    url = F'https://api.imgur.com/3/{url_type}/{imgur_hash}/images'
    payload = {}
    headers = {
        'Authorization': F'Client-ID {config.imgur_client_id}'
    }
    response = requests.request('GET', url, headers = headers, data = payload, allow_redirects=False)
    album_json = json.loads(response.text)['data']

    # Invalid album.
    if 'error' in album_json:
        print(F"Error: {album_json['error']}")
        return []

    # Valid album.
    if url_type == 'gallery' or url_type == 'album':
        # The returned JSON is in an array for albums and galleries, while it's a single JSON object for a single image.
        for image in album_json:
            image_urls.append(image['link'])
    else:
        # Single JSON object (from /image endpoint).
        image_urls.append(album_json['link'])

    return image_urls

def extract_outfit_urls_from_comment(comment: str) -> list:
    '''
    Extracts URLs from a given comment.
    Splits the comment twice. The function splits the comment once to check for URLs posted in plaintext, and once for URLs posted in Markdown.
    Returns a set of URLs. 
    NOTE: This assumes that the comment has outfit URLs in plaintext or properly formatted Markdown. Outfit URLs in ill-formatted Markdown will be ignored.
    But, there will be cron jobs or something similar to regularly update threads, and ideally will capture comments that are updated (such as with proper Markdown).
    '''
    # TODO: Find a more efficient way of extracting URLs in plaintext and Markdown.

    outfit_urls = set()

    # Extraction of plaintext URLs.
    for token in comment.split():
        if token.startswith('http') or token.startswith('https'):
            outfit_urls.add(token)

    # Extraction of Markdown URLs.
    for token in comment.split(']('):
        if (token.startswith('http') or token.startswith('https')) and ')' in token:
            res = token.split(')')
            outfit_urls.add(res[0])

    # Santitize URLs for any superfluous punctuation. 
    # Adapted from: https://stackoverflow.com/questions/52118382/removing-special-characters-punctuation-for-the-end-of-a-python-list-of-urls
    outfit_urls = [re.sub('[^a-zA-Z0-9]+$','',URL) for URL in outfit_urls]

    # Filter out URLs that are not Imgur or Dressed.so domains.

    outfit_urls = [url for url in outfit_urls if is_imgur_url(url) or is_dressed_so_url(url)]

    return outfit_urls

def create_imgur_url_info(imgur_url: str) -> dict:
    '''
    Given an Imgur URL, determines if the URL is an album, gallery, Imgur image, or single image (.png, .jpeg, .jpg)
    Returns a dictionary where the first element is the type of URL, and the second element is the alphanumeric hash (if applicable).
    Type is chosen from {'album', 'gallery', 'imgur_image', {'png', 'jpeg', 'jpg'}}.
    '''

    parsed_url = urlparse(imgur_url)
    parsed_url_path = parsed_url.path

    is_single_image = imgur_url.endswith(('.jpg', '.jpeg', '.png'))
    is_album = parsed_url_path.startswith('/a/')
    is_gallery = parsed_url_path.startswith('/gallery/')

    if is_album and not is_single_image:
        # Album.
        return {'url_type': 'album', 'imgur_hash': parsed_url_path[3:]}
    elif is_gallery and not is_single_image:
        # Gallery.
        return {'url_type': 'gallery', 'imgur_hash': parsed_url_path[9:]}
    elif is_single_image and not is_album and not is_gallery:
        # Single image (e.g. ending in .jpg, .jpeg, or .png)
        # Regular expression adapted from: https://stackoverflow.com/questions/23259110/python-splitting-a-string-twice
        # Split on / and . to get the alphanumeric hash, and isolate it. When displaying images, we will use one MIME type, namely .png.
        return {'url_type': 'single_image', 'imgur_hash': re.split(r'[/.]', parsed_url_path)[1]}
    elif parsed_url.netloc == 'imgur.com' and imgur_url[-1] != '/' and not is_single_image and not is_album and not is_gallery:
        # Imgur image. Check to make sure it starts with imgur.com and it also does not end at / (as in: https://imgur.com/)
        return {'url_type': 'image', 'imgur_hash': parsed_url_path[1:]}
    else:
        # Invalid URL.
        return {'url_type': 'ERROR', 'imgur_hash': 'ERROR'}