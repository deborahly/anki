from sqlite3 import connect
from urllib import response
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from .models import BasicCard, CardDeck, User
import lxml.html, json
from django.test.client import Client

# Create your tests here.
class IntegrationTestCase(StaticLiveServerTestCase):
    
    USERNAME1 = 'deborahly'
    USER1_PASSWORD = '12345'
    USERNAME2 = 'anderson'
    USER2_PASSWORD = '12345'
    
    def setUp(self):
        super().setUp()

        user1 = User.objects.create_user(username=self.USERNAME1, email=f'{self.USERNAME1}@example.com', password=self.USER1_PASSWORD)
        user1.is_superuser = True
        user1.is_staff = True
        user1.save()

        user2 = User.objects.create_user(username=self.USERNAME2, email=f'{self.USERNAME2}@example.com', password=self.USER2_PASSWORD)
        user2.is_superuser = True
        user2.is_staff = True
        user2.save()

        # user1_client = Client()
        # user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        # self.user2_client = Client()
        # self.user2_client.login(username=self.USERNAME2, password=self.USER2_PASSWORD)

        deck_user1_animals = CardDeck.objects.create(user=user1, name='Animals')
        deck_user1_food = CardDeck.objects.create(user=user1, name='Food')

        deck_user2_animals = CardDeck.objects.create(user=user2, name='Animals')
        deck_user2_music = CardDeck.objects.create(user=user2, name='Music')

        BasicCard.objects.create(user=user1, grammar_class='Noun', front='papillon', front_extra='m, s', back_main='butterfly', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='écureuil', front_extra='m, s', back_main='squirrel', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='baleine', front_extra='f, s', back_main='whale', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='souris', front_extra='f, s', back_main='mouse', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='coccinelle', front_extra='f, s', back_main='ladybug', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='abeille', front_extra='f, s', back_main='bee', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='renard', front_extra='m, s', back_main='fox', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='ours, ourse', back_main='bear', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='chien, chienne', back_main='dog', deck=deck_user1_animals)
        BasicCard.objects.create(user=user1, grammar_class='Noun', front='chat, chatte', back_main='cat', deck=deck_user1_animals)

        BasicCard.objects.create(user=user2, grammar_class='Noun', front='papillon', front_extra='m, s', back_main='butterfly', deck=deck_user2_animals)
        BasicCard.objects.create(user=user2, grammar_class='Verb', front='jouer', front_extra='à, au', back_main='to play (an instrument)', deck=deck_user2_music)
        BasicCard.objects.create(user=user2, grammar_class='Adjectif', front='classique', front_extra='m/f, s', back_main='classic', deck=deck_user2_music)
        BasicCard.objects.create(user=user2, grammar_class='Adverb', front='doucement', back_main='slowly', back_alt_1='quietly', back_alt_2='softly', deck=deck_user2_music)
        BasicCard.objects.create(user=user2, grammar_class='Other', front='solo de guitare', front_extra='m, s', back_main='guitar solo', deck=deck_user2_music)

    def test_index(self):
        r = self.client.get('/')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        assert r.status_code == 200
        assert title.text_content() == 'Index'

    def test_play(self):
        user1_client = Client()
        user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        r = user1_client.get('/play')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//a[@class="deck"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        assert r.status_code == 200
        assert title.text_content() == 'Play cards'
        assert 'Animals' in decks_content
        assert 'Food' in decks_content

    def test_collection(self):
        user1_client = Client()
        user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        r = user1_client.get('/collection')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//a[@class="deck"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
        assert 'Animals' in decks_content
        assert 'Food' in decks_content

    def test_retrieve(self):
        user1_client = Client()
        user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        DECK_ID = 1
        r = user1_client.get(f'/retrieve?id={DECK_ID}', follow=True)
        r_json = r.json()
        assert r.status_code == 200
        assert type(r_json['cards']) == list
        assert r_json['deck']['id'] == DECK_ID

    def test_create_deck(self):
        user1_client = Client()
        user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)
        user1 = User.objects.get(username='deborahly')
        CREATE_TYPE = 'deck'
        data = {
            'name': 'School'
        }
        r = user1_client.post(f'/create/{CREATE_TYPE}', data=data, follow=True)
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//a[@class="deck"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        CardDeck.objects.get(name='School', user=user1)
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
        assert 'School' in decks_content

    def test_create_basic_card(self):
        user1_client = Client()
        user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        CREATE_TYPE = 'basic card'
        DECK_ID = 1
        data = {
            'grammar_class': 'NOUN',
            'easiness': 'NORMAL',
            'front': 'loup, louve',
            'front_extra': '',
            'back_main': 'wolf',
            'back_alt_1': '',
            'back_alt_2': '',
            'deck': DECK_ID
        }
        r = user1_client.post(f'/create/{CREATE_TYPE}', data=data, follow=True)
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        BasicCard.objects.get(front='loup, louve', deck=DECK_ID)
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
    
    # def test_update_card(self):
    #     user1_client = Client()
    #     user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

    #     DECK_ID = CardDeck.objects.get(name='Animals', user=user1).id
    #     CARD_ID = BasicCard.objects.get(front='papillon', user=user1).id
    #     data = {
    #         'grammar_class': 'NOUN',
    #         'easiness': 'PIECE OF CAKE',
    #         'front': 'papillon',
    #         'front_extra': 'm, s',
    #         'back_main': 'butterfly',
    #         'back_alt_1': '',
    #         'back_alt_2': '',
    #         'deck': DECK_ID,
    #         'id': CARD_ID
    #     }
    #     r = user1_client.post('/update/card', data=data)
    #     r_json = r.json()
    #     assert r.status_code == 200
    #     assert r_json['card']['easiness'] == 'PIECE OF CAKE'

    # def test_delete_card(self):
    #     user1_client = Client()
    #     user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

    #     CARD_ID = BasicCard.objects.get(front='chat, chatte', user=user1).id
    #     data = {
    #         'id': CARD_ID
    #     }
    #     r = user1_client.post('/delete/card', json.dumps(data), content_type='application/json')
    #     r_json = r.json()
    #     l = BasicCard.objects.filter(pk=CARD_ID)
    #     assert len(l) == 0
    #     assert r_json['message'] == 'Card deleted'
    #     assert r.status_code == 200

    def test_easiness_card(self):
        user1_client = Client()
        user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        user1 = User.objects.get(username='deborahly')
        CARD_ID = BasicCard.objects.get(front='chat, chatte', user=user1).id
        data = {
            'id': CARD_ID,
            'easiness': 'PIECE OF CAKE'
        }
        r = user1_client.put('/easiness/card', json.dumps(data), content_type='application/json')
        r_json = r.json()
        card = BasicCard.objects.get(pk=CARD_ID)
        assert card.easiness == 'PIECE OF CAKE'
        assert r_json['message'] == 'Card easiness updated'
        assert r.status_code == 200

    # def test_get_archive(self):
    #     user1_client = Client()
    #     user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

    #     r = user1_client.get('/archive')
    #     tree = lxml.html.fromstring(r.content)
    #     title = tree.xpath('//title')[0]
    #     assert r.status_code == 200
    #     assert title.text_content() == 'Archive'

    # def test_post_archive_unarchive(self):
    #     user1_client = Client()
    #     user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)
    #     # Archive
    #     DECK_ID = 1
    #     data = {
    #         'deck-to-archive': DECK_ID
    #     }
    #     r = user1_client.post('/archive', data=data, follow=True)
    #     tree = lxml.html.fromstring(r.content)
    #     title = tree.xpath('//title')[0]
    #     deck = CardDeck.objects.get(pk=DECK_ID)
    #     assert r.status_code == 200
    #     assert title.text_content() == 'Archive'
    #     assert deck.archived == True
    #     # Unarchive
    #     data = {
    #         'deck_id': DECK_ID
    #     }
    #     r = user1_client.post('/unarchive', json.dumps(data), content_type='application/json')
    #     r_json = r.json()
    #     deck = CardDeck.objects.get(pk=DECK_ID)
    #     assert r.status_code == 200
    #     assert r_json['message'] == 'Deck unarchived'
    #     assert deck.archived == False

    # def test_delete_deck(self):
    #     user1_client = Client()
    #     user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

    #     DECK_ID = 1
    #     data = {
    #         'deck_id': DECK_ID
    #     }
    #     r = user1_client.post('/delete/deck', json.dumps(data), content_type='application/json')
    #     r_json = r.json()
    #     assert r.status_code == 200
    #     assert r_json['message'] == 'Deck deleted'