from database import RedditOutfitsDatabase
import config
from util_url import is_url_down
'''
This script is ran once a month, checking each outfit to see if it is still up/alive.
'''

# Establish a connection to the database.
database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits', config.redditoutfits_password)

# Retrieve all outfits (and by association, all of their URLs).
outfits = database.select_all_outfits()

# Check if each image is up.
for outfit in outfits:
    # We index using the second element because that is where the outfit URL is stored.
    if is_url_down(outfit[2]):
        database.delete_image(outfit[2])

database.close()