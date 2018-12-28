import unittest
from backfill_db import extract_outfit_links

class TestExtractOutfitLinks(unittest.TestCase):

    def setUp(self):
        pass
    
    # Returns True if the comment contains Imgur links.
    def test_extract_links_imgur(self):
        comment = 'Here are my fits: [1](https://imgur.com/abc123), [2](https://imgur.com/a/h53tew), and [3](https://imgur.com/3f82ttf)'
        self.assertCountEqual(extract_outfit_links(comment), {'https://imgur.com/abc123', 'https://imgur.com/a/h53tew', 'https://imgur.com/3f82ttf'})
    
    # Returns True if the comment contains Dressed.so links.
    def test_extract_outfit_links_dressed_so(self):
        comment = 'Here are my outfits for today: [1](http://dressed.so/post/view/e94jiegj944), [2](http://dressed.so/post/view/fh843ht2849ewj), and [3](http://dressed.so/post/view/r4398tg9ejv)'        
        self.assertCountEqual(extract_outfit_links(comment), {'http://dressed.so/post/view/e94jiegj944', 'http://dressed.so/post/view/fh843ht2849ewj', 'http://dressed.so/post/view/r4398tg9ejv'})

    # Returns True if the comment contains neither Imgur nor Dressed.so links.
    def test_extract_outfit_links_invalid_links(self):
        comment = 'I don\'t have any outfits, but follow me on [Instagram!](https://Instagram.com/abc123). Follow me on [reddit!](https://reddit.com/u/abc123)'
        self.assertCountEqual(extract_outfit_links(comment), set())

    # Returns True if the comment contains both Imgur and Dressed.so links.
    def test_extract_outfit_links_both(self):
        comment = 'I like posting on Imgur and Dressed.so, so here are my outfits on both platforms: https://imgur.com/a1b2c3, http://dressed.so/post/view/fh84th349tg4.'
        self.assertCountEqual(extract_outfit_links(comment), {'https://imgur.com/a1b2c3', 'http://dressed.so/post/view/fh84th349tg4'})

    # Returns True if the comment contains Imgur links that are .jpg.
    def test_extract_outfit_links_imgur_jpg(self):
        comment = 'Here are direct links to my fits: [1](https://i.imgur.com/sabr243tn.jpg) and [2](https://imgur.com/r3w9tjg.jpg)'
        self.assertCountEqual(extract_outfit_links(comment), {'https://i.imgur.com/sabr243tn.jpg', 'https://imgur.com/r3w9tjg.jpg'})

    # Returns True if the comment contains Imgur links that are .png.
    def test_extract_outfit_links_imgur_png(self):
        comment = 'Here are direct links to my fits: [1](https://i.imgur.com/sabr243tn.png) and [2](https://imgur.com/r3w9tjg.png)'
        self.assertCountEqual(extract_outfit_links(comment), {'https://i.imgur.com/sabr243tn.png', 'https://imgur.com/r3w9tjg.png'})

    # Returns True if the comment contains Dressed.so links that are .jpg.
    def test_extract_outfit_links_dressed_so_jpg(self):
        comment = 'Here are direct links to my outfits: [1](http://cdn.dressed.so/i/jt39wegjt4yeh53.jpg) and [2](http://cdn.dressed.so/i/53u9532jt9j6.jpg)'
        self.assertCountEqual(extract_outfit_links(comment), {'http://cdn.dressed.so/i/jt39wegjt4yeh53.jpg', 'http://cdn.dressed.so/i/53u9532jt9j6.jpg'})

    # Returns True if the comment contains Dressed.so links that are .png.
    def test_extract_outfit_links_dressed_so_png(self):
        comment = 'Here are direct links to my outfits: [1](http://cdn.dressed.so/i/3j953296tj30g.png) and [2](http://cdn.dressed.so/i/tj392jt694gj.png)'
        self.assertCountEqual(extract_outfit_links(comment), {'http://cdn.dressed.so/i/3j953296tj30g.png', 'http://cdn.dressed.so/i/tj392jt694gj.png'})

    # Returns True if the comment contains both types of outfit links that are .jpg.
    def test_extract_outfit_links_both_jpg(self):
        comment = 'Here are direct links to my outfits: [1](https://i.imgur.com/3j692tj0t3.jpg) and [2](http://cdn.dressed.so/i/35i06i436i043g0.jpg)'
        self.assertCountEqual(extract_outfit_links(comment), {'https://i.imgur.com/3j692tj0t3.jpg', 'http://cdn.dressed.so/i/35i06i436i043g0.jpg'})

    # Returns True if the comment contains both types of outfit links that are .png.
    def test_extract_outfit_links_both_png(self):
        comment = 'Here are direct links to my outfits: [1](https://i.imgur.com/3t603jt0gwfe.png) and [2](http://cdn.dressed.so/i/3j643i6043i60eg.png)'
        self.assertCountEqual(extract_outfit_links(comment), {'https://i.imgur.com/3t603jt0gwfe.png', 'http://cdn.dressed.so/i/3j643i6043i60eg.png'})

    # Returns True if the comment contains both types of outfit links that are either .jpg or .png.
    def test_extract_outfit_links_both_jpg_png(self):
        comment = 'Here are direct links to my outfits: [1](https://i.imgur.com/rj3926tj0ef.jpg), [2](https://imgur.com/tj39tj430gojef.png), [3](http://cdn.dressed.so/i/3j59t2jwe0f3643t.jpg), and [4](http://cdn.dressed.so/i/j323j60t34rf.png)'
        self.assertCountEqual(extract_outfit_links(comment), {'https://i.imgur.com/rj3926tj0ef.jpg', 'https://imgur.com/tj39tj430gojef.png', 'http://cdn.dressed.so/i/3j59t2jwe0f3643t.jpg', 'http://cdn.dressed.so/i/j323j60t34rf.png'})

if __name__ == '__main__':
    unittest.main()