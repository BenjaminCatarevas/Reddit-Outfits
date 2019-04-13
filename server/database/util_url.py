import json
import re
import requests
from urllib.parse import urlparse
from furl import furl

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


def is_twimg_url(url: str) -> bool:
    '''
    Determines if a given URL is a pbs.twimg URL using urlparse.
    Returns True if so, False otherwise.
    '''

    parsed_url = urlparse(url)
    host = parsed_url.netloc
    return host == 'pbs.twimg.com'


def is_ibbco_url(url: str) -> bool:
    '''
    Determines if a given URL is a i.ibb.co URL using urlparse.
    Returns True if so, False otherwise.
    '''

    parsed_url = urlparse(url)
    host = parsed_url.netloc
    return host == 'i.ibb.co'


def is_cdninstagram_url(url: str) -> bool:
    '''
    Determines if a given URL is a direct-link Instagram URL using urlparse.
    Returns True if so, False otherwise.
    '''

    parsed_url = urlparse(url)
    host = parsed_url.netloc
    return 'cdninstagram.com' in host


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
    response = requests.request(
        'GET', url, headers=headers, data=payload, allow_redirects=False)
    image_json = json.loads(response.text)['data']

    # Invalid Imgur URL.
    if 'error' in image_json:
        print('-------------------------')
        print(F'Query URL: {url}')
        print(F'Error with Imgur API: {image_json["error"]}')
        print(F'Imgur URL: {imgur_url}')
        print(F'Imgur Hash: {imgur_hash}')
        print(F'URL type: {url_type}')
        print(F'JSON: {image_json}')
        print('-------------------------')
        return []

    # The JSON format is the same for a single image, gallery, or album.
    # However, the Imgur endpoint returns a list of dictionaries in the event there are multiple images.
    # So we check if the returned JSON is a dict. If so, we can directly access its values. Else, it's a list of dicts, so we iterate.
    if isinstance(image_json, dict):
        image_urls.append(image_json['link'])
    else:
        for image in image_json:
            image_urls.append(image['link'])

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
    outfit_urls = [re.sub('[^a-zA-Z0-9]+$', '', URL) for URL in outfit_urls]

    # Filter out URLs that are not Imgur, Dressed.so, or redd.it domains (also turns the set into a list).
    # Also check if the URL is up or not. If not, ignore.
    # Assuming the conditions are met, remove the query string part of the URLs if applicable (does nothing if no query string).
    outfit_urls = [furl(url).remove(args=True, fragment=True).url for url in outfit_urls if (
        is_imgur_url(url) or is_dressed_so_url(url) or is_reddit_url(url) or is_twimg_url(url) or is_ibbco_url(url) or is_cdninstagram_url(url)) and not is_url_down(url)]

    return outfit_urls


def generate_imgur_url_info(imgur_url: str) -> dict:
    '''
    Given an Imgur URL, determines if the URL is an album, gallery, Imgur image, or single image (.png, .jpeg, .jpg, .gif, .gifv)
    Returns a dictionary where the first element is the type of URL, and the second element is the alphanumeric hash (if applicable).
    Type is chosen from {{'album', 'gallery', 'imgur_image'}, {'png', 'jpeg', 'jpg', '.gif', '.gifv'}}.
    '''

    parsed_url = urlparse(imgur_url)
    parsed_url_path = parsed_url.path

    is_single_image = imgur_url.endswith(
        ('.jpg', '.jpeg', '.png', '.gif', '.gifv'))
    is_album = parsed_url_path.startswith('/a/')
    is_gallery = parsed_url_path.startswith('/gallery/')

    if is_album:
        return {'url_type': 'album', 'imgur_hash': parsed_url_path[3:]}
    elif is_gallery:
        return {'url_type': 'gallery', 'imgur_hash': parsed_url_path[9:]}
    elif is_single_image:
        # A single image is one that links directly to a file e.g. ending in .jpg, .jpeg, .png, .gif, or .gifv.
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

    # dressed.so direct-image links do not support HTTPS.
    # Thus, we have to check if the URL starts with http. If so, if it's a dressed.so url, we leave it as is.
    # Else, we replace http with https.
    parsed_url = urlparse(url)
    if parsed_url.scheme == 'http':
        if not is_dressed_so_url(url):
            # If it's not a dressed.so URL, change HTTP to HTTPS.
            url = url.replace('http://', 'https://')
        # If it is a dressed.so URL, leave it as HTTP.
    elif not parsed_url.scheme == 'https':
        # If the URL does not start with https://, add it to the front of the URL.
        url = 'https://' + url

    # Approach adapted from: https://stackoverflow.com/a/15743618
    # TODO: Use try and catch block for invalid URLs that make it through above checks
    # also use GET request?
    try:
        r = requests.head(url)
        # cdn.dressed.so returns 403 if there is no image found at the URL.
        # i.imgur.com returns 302 if image is not found.
        # We assume if the URL has been moved (301), the URL is no longer active.
        # imgur.com and i.redd.it returns 404 if image is not found.
        return r.status_code in (403, 302, 301, 404)
    except Exception as e:
        print('-------------------------')
        print('Invalid URL: ', url)
        print('Error: ', str(e))
        print('-------------------------')
        return True
