'''
This script will be called once and will be used to backfill the database for all subreddits.
'''

from database import RedditOutfitsDatabase
from util_reddit import generate_thread_ids

def insert_threads(thread_ids, database):
    for thread_id in thread_ids:
        database.process_thread(thread_id)

# Establish a connection to the database.
database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits')

# Generate thread IDs for all subreddits.
malefashionadvice_thread_ids_automoderator = generate_thread_ids('WAYWT', 'AutoModerator', 'malefashionadvice', 500)
malefashionadvice_thread_ids_mfamoderator = generate_thread_ids('WAYWT', 'MFAModerator', 'malefashionadvice', 500)
femalefashionadvice_thread_ids_automoderator = generate_thread_ids('WAYWT', 'AutoModerator', 'femalefashionadvice', 500)
streetwear_thread_ids_automoderator = generate_thread_ids('WDYWT', 'AutoModerator', 'streetwear', 500)

insert_threads(malefashionadvice_thread_ids_automoderator, database)
insert_threads(malefashionadvice_thread_ids_mfamoderator, database)
insert_threads(femalefashionadvice_thread_ids_automoderator, database)
insert_threads(streetwear_thread_ids_automoderator, database)