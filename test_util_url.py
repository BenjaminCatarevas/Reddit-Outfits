import unittest
from util_url import extract_outfit_urls_from_comment, is_imgur_url, is_dressed_so_url, create_imgur_url_info

class TestExtractOutfitURLs(unittest.TestCase):

    def setUp(self):
        pass
    
    # Returns True if the comment contains Imgur URLs.
    def test_extract_outfit_urls_from_comment_imgur(self):
        comment = 'Here are my fits: [1](https://imgur.com/abc123), [2](https://imgur.com/a/h53tew), and [3](https://imgur.com/3f82ttf)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://imgur.com/abc123', 'https://imgur.com/a/h53tew', 'https://imgur.com/3f82ttf'})
    
    # Returns True if the comment contains Dressed.so URLs.
    def test_extract_outfit_urls_from_comment_dressed_so(self):
        comment = 'Here are my outfits for today: [1](http://dressed.so/post/view/e94jiegj944), [2](http://dressed.so/post/view/fh843ht2849ewj), and [3](http://dressed.so/post/view/r4398tg9ejv)'        
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'http://dressed.so/post/view/e94jiegj944', 'http://dressed.so/post/view/fh843ht2849ewj', 'http://dressed.so/post/view/r4398tg9ejv'})

    # Returns True if the comment contains neither Imgur nor Dressed.so URLs.
    def test_extract_outfit_urls_from_comment_invalid_URLs(self):
        comment = 'I don\'t have any outfits, but follow me on [Instagram!](https://Instagram.com/abc123). Follow me on [reddit!](https://reddit.com/u/abc123)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), set())

    # Returns True if the comment contains both Imgur and Dressed.so URLs.
    def test_extract_outfit_urls_from_comment_both(self):
        comment = 'I like posting on Imgur and Dressed.so, so here are my outfits on both platforms: https://imgur.com/a1b2c3, http://dressed.so/post/view/fh84th349tg4.'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://imgur.com/a1b2c3', 'http://dressed.so/post/view/fh84th349tg4'})

    # Returns True if the comment contains Imgur URLs that are .jpg.
    def test_extract_outfit_urls_from_comment_imgur_jpg(self):
        comment = 'Here are direct URLs to my fits: [1](https://i.imgur.com/sabr243tn.jpg) and [2](https://imgur.com/r3w9tjg.jpg)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://i.imgur.com/sabr243tn.jpg', 'https://imgur.com/r3w9tjg.jpg'})

    # Returns True if the comment contains Imgur URLs that are .png.
    def test_extract_outfit_urls_from_comment_imgur_png(self):
        comment = 'Here are direct URLs to my fits: [1](https://i.imgur.com/sabr243tn.png) and [2](https://imgur.com/r3w9tjg.png)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://i.imgur.com/sabr243tn.png', 'https://imgur.com/r3w9tjg.png'})

    # Returns True if the comment contains Dressed.so URLs that are .jpg.
    def test_extract_outfit_urls_from_comment_dressed_so_jpg(self):
        comment = 'Here are direct URLs to my outfits: [1](http://cdn.dressed.so/i/jt39wegjt4yeh53.jpg) and [2](http://cdn.dressed.so/i/53u9532jt9j6.jpg)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'http://cdn.dressed.so/i/jt39wegjt4yeh53.jpg', 'http://cdn.dressed.so/i/53u9532jt9j6.jpg'})

    # Returns True if the comment contains Dressed.so URLs that are .png.
    def test_extract_outfit_urls_from_comment_dressed_so_png(self):
        comment = 'Here are direct URLs to my outfits: [1](http://cdn.dressed.so/i/3j953296tj30g.png) and [2](http://cdn.dressed.so/i/tj392jt694gj.png)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'http://cdn.dressed.so/i/3j953296tj30g.png', 'http://cdn.dressed.so/i/tj392jt694gj.png'})

    # Returns True if the comment contains both types of outfit URLs that are .jpg.
    def test_extract_outfit_urls_from_comment_both_jpg(self):
        comment = 'Here are direct URLs to my outfits: [1](https://i.imgur.com/3j692tj0t3.jpg) and [2](http://cdn.dressed.so/i/35i06i436i043g0.jpg)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://i.imgur.com/3j692tj0t3.jpg', 'http://cdn.dressed.so/i/35i06i436i043g0.jpg'})

    # Returns True if the comment contains both types of outfit URLs that are .png.
    def test_extract_outfit_urls_from_comment_both_png(self):
        comment = 'Here are direct URLs to my outfits: [1](https://i.imgur.com/3t603jt0gwfe.png) and [2](http://cdn.dressed.so/i/3j643i6043i60eg.png)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://i.imgur.com/3t603jt0gwfe.png', 'http://cdn.dressed.so/i/3j643i6043i60eg.png'})

    # Returns True if the comment contains both types of outfit URLs that are either .jpg or .png.
    def test_extract_outfit_urls_from_comment_both_jpg_png(self):
        comment = 'Here are direct URLs to my outfits: [1](https://i.imgur.com/rj3926tj0ef.jpg), [2](https://imgur.com/tj39tj430gojef.png), [3](http://cdn.dressed.so/i/3j59t2jwe0f3643t.jpg), and [4](http://cdn.dressed.so/i/j323j60t34rf.png)'
        self.assertCountEqual(extract_outfit_urls_from_comment(comment), {'https://i.imgur.com/rj3926tj0ef.jpg', 'https://imgur.com/tj39tj430gojef.png', 'http://cdn.dressed.so/i/3j59t2jwe0f3643t.jpg', 'http://cdn.dressed.so/i/j323j60t34rf.png'})

class TestIsImgurURL(unittest.TestCase):
    def setUp(self):
        pass

    # Returns True if the URL is an Imgur link.
    def test_is_imgur_url_imgur(self):
        url = 'https://imgur.com/a/326trwef'
        self.assertEqual(is_imgur_url(url), True)

    # Returns True if the URL is a cdn.dressed.so link.
    def test_is_imgur_url_i_imgur(self):
        url = 'https://i.imgur.com/rj3926tj0ef.jpg'
        self.assertEqual(is_imgur_url(url), True)

    # Returns False if the URL is not an Imgur or Dressed.so link.
    def test_is_imgur_url_other(self):
        url = 'https://instagram.com/wfn39qt4wg9ejqr3w'
        self.assertEqual(is_imgur_url(url), False)

class TestIsDressedSoUrl(unittest.TestCase):
    def setUp(self):
        pass

    # Returns True if the URL is a Dressed.so link.
    def test_is_dressed_so_url_dressed(self):
        url = 'http://dressed.so/post/view/fh84th349tg4'
        self.assertEqual(is_dressed_so_url(url), True)

    # Returns True if the URL is an i.imgur.com link.
    def test_is_dressed_so_url_cdn_dressed(self):
        url = 'http://cdn.dressed.so/i/3j953296tj30g.png'
        self.assertEqual(is_dressed_so_url(url), True)
    
    # Returns False if the URL is not an Imgur or Dressed.so link.
    def test_is_dressed_so_url_other(self):
        url = 'https://instagram.com/wfn39qt4wg9ejqr3w'
        self.assertEqual(is_dressed_so_url(url), False)

class TestCreateImgurUrlInfoUrl(unittest.TestCase):
    
    def setUp(self):
        pass

    # Returns True if the URL is an Imgur album.
    def test_create_imgur_url_info_album(self):
        url = 'https://imgur.com/a/f35t34wrtge'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'album', 'image_hash': 'f35t34wrtge'})

    # Returns True if the URL is an Imgur gallery.
    def test_create_imgur_url_info_gallery(self):
        url = 'https://imgur.com/gallery/t4wy3tfeh'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'gallery', 'image_hash': 't4wy3tfeh'})

    # Returns True if the URL is an Imgur image.
    def test_create_imgur_url_info_imgur_image(self):
        url = 'https://imgur.com/395ue9fj3t'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'image', 'image_hash': '395ue9fj3t'})

    # Returns True if the URL is a single .jpg image.
    def test_create_imgur_url_info_single_jpg(self):
        url = 'https://imgur.com/a35t9jfe.jpg'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'single_image', 'image_hash': 'a35t9jfe'})

    # Returns True if the URL is a single .jpeg image.
    def test_create_imgur_url_info_single_jpeg(self):
        url = 'https://imgur.com/4ge0jt0f.jpeg'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'single_image', 'image_hash': '4ge0jt0f'})

    # Returns True if the URL is a single .png image.
    def test_create_imgur_url_info_single_png(self):
        url = 'https://imgur.com/34i6jt94g0tf.png'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'single_image', 'image_hash': '34i6jt94g0tf'})

    # Returns False if the URL is not an Imgur URL.
    def test_create_imgur_url_info_not_imgur(self):
        url = 'https://google.com'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'ERROR', 'image_hash': 'ERROR'})

    # Returns False if the URL is Imgur's homepage, imgur.com/.
    def test_create_imgur_url_info_invalid_imgur(self):
        url = 'https://imgur.com/'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'ERROR', 'image_hash': 'ERROR'})

    def test_create_imgur_url_info_invalid_combination(self):
        url = 'https://imgur.com/a/fgtejgt.jpg'
        self.assertDictEqual(create_imgur_url_info(url), {'url_type': 'ERROR', 'image_hash': 'ERROR'})

if __name__ == '__main__':
    unittest.main()