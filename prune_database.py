from database import RedditOutfitsDatabase

'''
This script is ran once a month, checking each outfit to see if it is still alive/valid.
'''

# Establish a connection to the database.
database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits')

# Retrieve all outfits (and by association, all of their URLs).
outfits = database.select_all_images()

# Check if each image is alive.

if outfit_alive:
    database.delete_image(outfit_url)

database.close()