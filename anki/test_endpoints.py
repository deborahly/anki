from sqlite3 import connect
from django.test import TestCase
from .models import BasicCard, CardDeck, User
import lxml.html, json
from django.test.client import Client

# Create your tests here.
class IntegrationTestCase(TestCase):
    
    USERNAME1 = 'deborahly'
    USER1_PASSWORD = '12345'
    USERNAME2 = 'anderson'
    USER2_PASSWORD = '12345'
    
    def setUp(self):
        super().setUp()

        self.user1 = User.objects.create_user(username=self.USERNAME1, email=f'{self.USERNAME1}@example.com', password=self.USER1_PASSWORD)
        self.user1.is_superuser = True
        self.user1.is_staff = True
        self.user1.save()

        self.user2 = User.objects.create_user(username=self.USERNAME2, email=f'{self.USERNAME2}@example.com', password=self.USER2_PASSWORD)
        self.user2.is_superuser = True
        self.user2.is_staff = True
        self.user2.save()

        self.user1_client = Client()
        self.user1_client.login(username=self.USERNAME1, password=self.USER1_PASSWORD)

        self.user2_client = Client()
        self.user2_client.login(username=self.USERNAME2, password=self.USER2_PASSWORD)

        deck_user1_animals = CardDeck.objects.create(user=self.user1, name='Animals')
        deck_user1_food = CardDeck.objects.create(user=self.user1, name='Food')

        deck_user2_animals = CardDeck.objects.create(user=self.user2, name='Animals')
        deck_user2_music = CardDeck.objects.create(user=self.user2, name='Music')

        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='papillon', front_extra='m, s', back_main='butterfly', deck=deck_user1_animals, grade='NORMAL')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='écureuil', front_extra='m, s', back_main='squirrel', deck=deck_user1_animals, grade='PIECE OF CAKE')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='baleine', front_extra='f, s', back_main='whale', deck=deck_user1_animals, grade='CHALLENGING')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='souris', front_extra='f, s', back_main='mouse', deck=deck_user1_animals, grade='NORMAL')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='coccinelle', front_extra='f, s', back_main='ladybug', deck=deck_user1_animals, grade='PIECE OF CAKE')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='abeille', front_extra='f, s', back_main='bee', deck=deck_user1_animals, grade='CHALLENGING')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='renard', front_extra='m, s', back_main='fox', deck=deck_user1_animals, grade='NORMAL')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='ours, ourse', back_main='bear', deck=deck_user1_animals, grade='NORMAL')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='chien, chienne', back_main='dog', deck=deck_user1_animals, grade='NORMAL')
        BasicCard.objects.create(user=self.user1, grammar_class='Noun', front='chat, chatte', back_main='cat', deck=deck_user1_animals, grade='NORMAL')

        BasicCard.objects.create(user=self.user2, grammar_class='Noun', front='papillon', front_extra='m, s', back_main='butterfly', deck=deck_user2_animals)
        BasicCard.objects.create(user=self.user2, grammar_class='Verb', front='jouer', front_extra='à, au', back_main='to play (an instrument)', deck=deck_user2_music)
        BasicCard.objects.create(user=self.user2, grammar_class='Adjectif', front='classique', front_extra='m/f, s', back_main='classic', deck=deck_user2_music)
        BasicCard.objects.create(user=self.user2, grammar_class='Adverb', front='doucement', back_main='slowly', back_alt_1='quietly', back_alt_2='softly', deck=deck_user2_music)
        BasicCard.objects.create(user=self.user2, grammar_class='Other', front='solo de guitare', front_extra='m, s', back_main='guitar solo', deck=deck_user2_music)

    def test_index(self):
        r = self.client.get('/')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        assert r.status_code == 200
        assert title.text_content() == 'Index'

    def test_play(self):
        # User 1
        r = self.user1_client.get('/play')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//div[@class="play-deck"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        assert r.status_code == 200
        assert title.text_content() == 'Play cards'
        assert 'Animals' in decks_content
        assert 'Food' in decks_content
        # User 2
        r = self.user2_client.get('/play')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//div[@class="play-deck"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        assert r.status_code == 200
        assert title.text_content() == 'Play cards'
        assert 'Animals' in decks_content
        assert 'Music' in decks_content

    def test_collection(self):
        # User 1
        r = self.user1_client.get('/collection')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//a[@class="manage-link"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
        assert 'Animals' in decks_content
        assert 'Food' in decks_content
        # User 2
        r = self.user2_client.get('/collection')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//a[@class="manage-link"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
        assert 'Animals' in decks_content
        assert 'Music' in decks_content

    def test_retrieve_session(self):
        DECK_ID = 1
        QUANTITY = 3
        r = self.user1_client.get(f'/retrieve/session?id={DECK_ID}&quantity={QUANTITY}', follow=True)
        r_json = r.json()

        assert r.status_code == 200
        assert type(r_json['cards']) == list
        assert r_json['deck']['id'] == DECK_ID

    def test_retrieve_batch(self):
        DECK_ID = 1
        PAGE = 1
        PER_PAGE = 2
        r = self.user1_client.get(f'/retrieve/batch?id={DECK_ID}&page={PAGE}&per-page={PER_PAGE}', follow=True)
        r_json = r.json()
        assert r.status_code == 200
        assert r_json['pagination']['current'] == PAGE
        assert r_json['pagination']['has_next'] == True
        assert r_json['pagination']['has_previous'] == False
        assert len(r_json['cards']) == PER_PAGE

    def test_create_deck(self):
        CREATE_TYPE = 'deck'
        data = {
            'name': 'School'
        }
        r = self.user1_client.post(f'/create/{CREATE_TYPE}', data=data, follow=True)
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        decks = tree.xpath('//a[@class="manage-link"]')
        decks_content = []
        for deck in decks:
            decks_content.append(deck.text_content())
        CardDeck.objects.get(name='School', user=self.user1)
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
        assert 'School' in decks_content

    def test_create_basic_card(self):
        CREATE_TYPE = 'basic card'
        DECK_ID = 1
        data = {
            'grammar_class': 'NOUN',
            'grade': 'NORMAL',
            'front': 'loup, louve',
            'front_extra': '',
            'back_main': 'wolf',
            'back_alt_1': '',
            'back_alt_2': '',
            'deck': DECK_ID
        }
        r = self.user1_client.post(f'/create/{CREATE_TYPE}', data=data)
        # r = self.user1_client.post(f'/create/{CREATE_TYPE}', data=data, follow=True)
        # tree = lxml.html.fromstring(r.content)
        # title = tree.xpath('//title')[0]
        BasicCard.objects.get(front='loup, louve', deck=DECK_ID)
        assert r.status_code == 200
        # assert r.status_code == 200
        # assert title.text_content() == 'My collection'
    
    def test_update_card(self):
        DECK_ID = CardDeck.objects.get(name='Animals', user=self.user1).id
        CARD_ID = BasicCard.objects.get(front='papillon', user=self.user1).id
        data = {
            'grammar_class': 'NOUN',
            'grade': 'PIECE OF CAKE',
            'front': 'papillon',
            'front_extra': 'm, s',
            'back_main': 'butterfly',
            'back_alt_1': '',
            'back_alt_2': '',
            'deck': DECK_ID,
            'id': CARD_ID
        }
        r = self.user1_client.post('/update/card', data=data)
        r_json = r.json()
        assert r.status_code == 200
        assert r_json['card']['grade'] == 'PIECE OF CAKE'

    def test_delete_card(self):
        CARD_ID = BasicCard.objects.get(front='chat, chatte', user=self.user1).id
        data = {
            'id': CARD_ID
        }
        r = self.user1_client.post('/delete/card', json.dumps(data), content_type='application/json')
        r_json = r.json()
        l = BasicCard.objects.filter(pk=CARD_ID)
        assert len(l) == 0
        assert r_json['message'] == 'Card deleted'
        assert r.status_code == 200

    def test_grade_card(self):
        CARD_ID = BasicCard.objects.get(front='chat, chatte', user=self.user1).id
        data = {
            'id': CARD_ID,
            'grade': 'PIECE OF CAKE'
        }
        r = self.user1_client.put('/grade/card', json.dumps(data), content_type='application/json')
        r_json = r.json()
        card = BasicCard.objects.get(pk=CARD_ID)
        assert card.grade == 'PIECE OF CAKE'
        assert r_json['message'] == 'Card grade updated'
        assert r.status_code == 200

    def test_get_archive(self):
        r = self.user1_client.get('/archive')
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        assert r.status_code == 200
        assert title.text_content() == 'Archive'

    def test_post_archive_unarchive(self):
        # Archive
        DECK_ID = 1
        data = {
            'deck-to-archive': DECK_ID
        }
        r = self.user1_client.post('/archive', data=data, follow=True)
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        deck = CardDeck.objects.get(pk=DECK_ID)
        assert r.status_code == 200
        assert title.text_content() == 'Archive'
        assert deck.archived == True
        # Unarchive
        data = {
            'deck-to-unarchive': DECK_ID
        }
        r = self.user1_client.post('/unarchive', data=data, follow=True)
        tree = lxml.html.fromstring(r.content)
        title = tree.xpath('//title')[0]
        deck = CardDeck.objects.get(pk=DECK_ID)
        assert r.status_code == 200
        assert title.text_content() == 'My collection'
        assert deck.archived == False
        # data = {
        #     'deck_id': DECK_ID
        # }
        # r = self.user1_client.post('/unarchive', json.dumps(data), content_type='application/json')
        # r_json = r.json()
        # deck = CardDeck.objects.get(pk=DECK_ID)
        # assert r.status_code == 200
        # assert r_json['message'] == 'Deck unarchived'
        # assert deck.archived == False

    def test_delete_deck(self):
        DECK_ID = 1
        data = {
            'deck_id': DECK_ID
        }
        r = self.user1_client.post('/delete/deck', json.dumps(data), content_type='application/json')
        r_json = r.json()
        assert r.status_code == 200
        assert r_json['message'] == 'Deck deleted'