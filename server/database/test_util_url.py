import unittest
from util_url import generate_imgur_url_info
from util_url import is_dressed_so_url
from util_url import is_imgur_url
from util_url import is_reddit_url


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
        url = 'https://instagram.com/4jy50t3efjw'
        self.assertEqual(is_dressed_so_url(url), False)


class TestIsRedditUrl(unittest.TestCase):
    def setUp(self):
        pass

    # Returns True if the URL is an i.redd.it URL.
    def test_is_reddit_url_reddit(self):
        url = 'https://i.redd.it/3tw9fh3t94ge.jpg'
        self.assertEqual(is_reddit_url(url), True)

    # Returns False if the URL is not an i.redd.it URL.
    def test_is_reddit_url_other(self):
        url = 'https://instagram.com/fgjefw0'
        self.assertEqual(is_reddit_url(url), False)


class TestCreateImgurUrlInfoUrl(unittest.TestCase):

    def setUp(self):
        pass

    # Returns True if the URL is an Imgur album.
    def test_generate_imgur_url_info_album(self):
        url = 'https://imgur.com/a/f35t34wrtge'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'album', 'imgur_hash': 'f35t34wrtge'})

    # Returns True if the URL is an Imgur gallery.
    def test_generate_imgur_url_info_gallery(self):
        url = 'https://imgur.com/gallery/t4wy3tfeh'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'gallery', 'imgur_hash': 't4wy3tfeh'})

    # Returns True if the URL is an Imgur image.
    def test_generate_imgur_url_info_imgur_image(self):
        url = 'https://imgur.com/395ue9fj3t'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'image', 'imgur_hash': '395ue9fj3t'})

    # Returns True if the URL is a single .jpg image.
    def test_generate_imgur_url_info_single_jpg(self):
        url = 'https://imgur.com/a35t9jfe.jpg'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'image', 'imgur_hash': 'a35t9jfe'})

    # Returns True if the URL is a single .jpeg image.
    def test_generate_imgur_url_info_single_jpeg(self):
        url = 'https://imgur.com/4ge0jt0f.jpeg'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'image', 'imgur_hash': '4ge0jt0f'})

    # Returns True if the URL is a single .png image.
    def test_generate_imgur_url_info_single_png(self):
        url = 'https://imgur.com/34i6jt94g0tf.png'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'image', 'imgur_hash': '34i6jt94g0tf'})

    # Returns False if the URL is not an Imgur URL.
    def test_generate_imgur_url_info_not_imgur(self):
        url = 'https://google.com'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'ERROR', 'imgur_hash': 'ERROR'})

    # Returns False if the URL is Imgur's homepage, imgur.com/.
    def test_generate_imgur_url_info_invalid_imgur(self):
        url = 'https://imgur.com/'
        self.assertDictEqual(generate_imgur_url_info(
            url), {'url_type': 'ERROR', 'imgur_hash': 'ERROR'})


if __name__ == '__main__':
    unittest.main()
