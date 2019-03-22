import json
import re
import requests
from urllib.parse import urlparse

import config

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

def is_reddit_url(url: str) -> bool:
    '''
    Determines if a given URL is a i.redd.it URL using urlparse.
    Returns True if so, False otherwise.
    '''

    parsed_url = urlparse(url)
    host = parsed_url.netloc.lower()
    return host == 'i.redd.it'

def extract_image_urls_from_imgur_url(imgur_url: str, imgur_hash: str, url_type: str) -> list:
    '''
    Extracts image URLs from either an Imgur album, image, or gallery, depending on url_type.
    Returns a list of image URLs.
    '''

    image_urls = []

    # Construct the Imgur API endpoint URL to ping and receive information about the URL.
    url = F'https://api.imgur.com/3/{url_type}/{imgur_hash}/images'
    payload = {}
    headers = {
        'Authorization': F'Client-ID {config.imgur_client_id}'
    }
    response = requests.request('GET', url, headers = headers, data = payload, allow_redirects=False)
    image_json = json.loads(response.text)['data']

    # Invalid Imgur URL.
    if 'error' in image_json:
        print(F"Error: {image_json['error']}")
        return []

    if url_type == 'gallery' or url_type == 'album':
        # From /album/ and /gallery/ endpoint
        # The returned JSON is in an array for albums and galleries, while it's a single JSON object for a single image.
        for image in image_json:
            image_urls.append(image['link'])
    else:
        # Single JSON object (from /image/ endpoint), so we access it directly.
        image_urls.append(image_json['link'])

    return image_urls

def extract_outfit_urls_from_comment_body(comment: str) -> list:
    '''
    Extracts URLs from a given comment.
    Splits the comment twice. The function splits the comment once to check for URLs posted in plaintext, and once for URLs posted in Markdown.
    Returns a list of URLs. 
    '''

    outfit_urls = set()

    # Remove Markdown for easier tokenizing.
    # Approach adapted from: https://stackoverflow.com/a/44593228
    for replacement in (('[', ' '), (']', ' '), ('(', ' '), (')', ' ')):
        comment = comment.replace(*replacement)
    
    # Links that don't start with http or https are considered invalid.
    for token in comment.split():
        if token.lower().startswith('http://') or token.lower().startswith('https://'):
            # NOTE: It is worth noting that dressed.so does not use HTTPS.
            # However, for storage purposes, we can leave links as is with HTTPS and change to HTTP for URL validation.
            # This has been done in the is_url_down function.
            outfit_urls.add(token)

    # Santitize URLs for any superfluous punctuation. Some users have a period at the end of their image URLs, so we sanitize that.
    # Adapted from: https://stackoverflow.com/a/52118554
    outfit_urls = [re.sub('[^a-zA-Z0-9]+$','',URL) for URL in outfit_urls]

    # Filter out URLs that are not Imgur, Dressed.so, or redd.it domains (also turns the set into a list).
    # Also check if the URL is up or not. If not, ignore.
    outfit_urls = [url for url in outfit_urls if not is_url_down(url) and (is_imgur_url(url) or is_dressed_so_url(url) or is_reddit_url(url))]

    return outfit_urls

def generate_imgur_url_info(imgur_url: str) -> dict:
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

    if is_album:
        return {'url_type': 'album', 'imgur_hash': parsed_url_path[3:]}
    elif is_gallery:
        return {'url_type': 'gallery', 'imgur_hash': parsed_url_path[9:]}
    elif is_single_image:
        # A single image is one that links directly to a file e.g. ending in .jpg, .jpeg, or .png.
        # Regular expression for hash parsing adapted from: https://stackoverflow.com/a/23259147
        # Split on / and . to get the alphanumeric hash, and isolate it.
        return {'url_type': 'image', 'imgur_hash': re.split(r'[/.]', parsed_url_path)[1]}
    elif parsed_url.netloc == 'imgur.com' and parsed_url.path != '/' and not is_single_image and not is_album and not is_gallery:
        # Imgur image. Check to make sure it starts with imgur.com and it also does not end at / (as in: https://imgur.com/)
        # Imgur URLs such as https://imgur.com/3t4tt4.
        return {'url_type': 'image', 'imgur_hash': parsed_url_path[1:]}
    else:
        return {'url_type': 'ERROR', 'imgur_hash': 'ERROR'}

def is_url_down(url: str) -> bool:
    '''
    Given a URL, determines if the given URL is down.
    Returns True if URL is down, False otherwise.
    Function adapted from: https://stackoverflow.com/a/15743618
    '''

    if url.lower().startswith('https://'):
        # The URL must start with http(s):// to make a successful HEAD request.
        # We replace https with http because dressed.so does not use HTTPS, and HTTP works for imgur and i.redd.it URLs.
        # NOTE: we use .startswith() because there is the chance, though incredibly low, that the string 'http' could appear in the URL in other places.
        # Using .startswith() ensures that we only check the necessary locations.
        url.replace('https', 'http')
    elif not url.lower().startswith('http://') or not url.lower().startswith('https://'):
        # If the URL doesn't start with either http or https, append http to it.
        url = 'http://' + url

    # Approach adapted from: https://stackoverflow.com/a/15743618
    r = requests.head(url)

    # cdn.dressed.so returns 403 if there is no image found at the URL.
    # i.imgur.com returns 302 if image is not found.
    # We assume if the URL has been moved (301), the URL is no longer active.
    # imgur.com and i.redd.it returns 404 if image is not found.
    return r.status_code in (403, 302, 301, 404)