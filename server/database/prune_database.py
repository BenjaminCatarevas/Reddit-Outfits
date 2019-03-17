import config
from database import RedditOutfitsDatabase
from util_url import is_url_down

'''
This script is ran once a month, checking each outfit to see if it is still up/alive.
'''

database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits', config.redditoutfits_password)

outfitRecords = database.select_all_outfits()

# Check if each image is up.
for outfitRecord in outfitRecords:
    # We delete by URL since we're concerned about whether or not the URL is up.
    if is_url_down(outfitRecord['outfit_url']):
        database.delete_outfit_by_url(outfitRecord['outfit_url'])

database.close()