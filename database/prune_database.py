import config
from database import RedditOutfitsDatabase
from util_url import is_url_down

'''
This script is ran once a month, checking each outfit to see if it is still up/alive.
'''

database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits', config.redditoutfits_password)

outfits = database.select_all_outfits()

# Check if each image is up.
for outfit in outfits:
    # We index using the second element because that is where the outfit URL is stored.
    if is_url_down(outfit['outfit_url']):
        database.delete_outfit(outfit['outfit_url'])

database.close()