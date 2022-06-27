"""
# Filename: run_self.selenium.py
"""

# Run selenium and chrome driver to scrape data from cloudbytes.dev
from cgi import test
import profile
import time
from typing import Text
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from django.test import TestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from .models import BasicCard, CardDeck, User
import django.core.management.commands.runserver as runserver

def wait_for_element(webdriver, method, query, wait_time=3):
    return WebDriverWait(webdriver, wait_time).until(EC.presence_of_element_located((method, query)))

def wait_until_not_present(webdriver, method, query, wait_time=3):
    return WebDriverWait(webdriver, wait_time).until_not(EC.presence_of_element_located((method, query)))

# Create your tests here.
class IntegrationTestCase(StaticLiveServerTestCase):
    
    USERNAME1 = 'deborahly'
    USER1_PASSWORD = '12345'
    USERNAME2 = 'anderson'
    USER2_PASSWORD = '12345'
    # POSTS_PER_PAGE = 10
    host = '127.0.0.1'
    port = 8000

    def create_driver(self):
        # Setup chrome options
        chrome_options = Options()
        # chrome_options.add_argument('--headless') # Ensure GUI is off
        # chrome_options.add_argument('--no-sandbox')

        # Set path to chromedriver as per configuration
        webdriver_service = Service('/opt/chromedriver')

        # Choose Chrome Browser
        return webdriver.Chrome(service=webdriver_service, options=chrome_options)

    def setUp(self):
        super().setUp()

        user1 = User.objects.create_user(username=self.USERNAME1, email=f"{self.USERNAME1}@example.com", password=self.USER1_PASSWORD)
        user2 = User.objects.create_user(username=self.USERNAME2, email=f"{self.USERNAME2}y@example.com", password=self.USER2_PASSWORD)

        user1.is_superuser = True
        user1.is_staff = True
        user1.save()

        # Create decks
        deck_user1_animals = CardDeck.objects.create(user=user1, name='Animals')
        deck_user1_food = CardDeck.objects.create(user=user1, name='Food')

        deck_user2_animals = CardDeck.objects.create(user=user2, name='Animals')
        deck_user2_music = CardDeck.objects.create(user=user2, name='Music')

        # Create cards
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

        self.selenium = self.create_driver()

    def login(self, webdriver):
        webdriver.get(self.live_server_url)
        login_link = wait_for_element(webdriver, By.XPATH, '//a[@href="/login"]')
        login_link.click()

        username = wait_for_element(webdriver, By.XPATH, '//*[@name="username"]')
        username.send_keys(self.USERNAME1)
        password = wait_for_element(webdriver, By.XPATH, '//*[@name="password"]')
        password.send_keys(self.USER1_PASSWORD)

        login_button = wait_for_element(webdriver, By.XPATH, '//input[@value="Login"]')
        login_button.click()

    # def test_play_decks_should_exist(self):
    #     self.login(self.selenium)
        
    #     play_link = wait_for_element(self.selenium, By.XPATH, '//a[@href="/play"]')
    #     play_link.click()

    #     wait_for_element(self.selenium, By.XPATH, '//a[@class="deck" and contains(text(), "Animals")]')
    #     wait_for_element(self.selenium, By.XPATH, '//a[@class="deck" and contains(text(), "Food")]')

    # def test_collection_decks_should_exist(self):
    #     self.login(self.selenium)
        
    #     collection_link = wait_for_element(self.selenium, By.XPATH, '//a[@href="/collection"]')
    #     collection_link.click()

    #     wait_for_element(self.selenium, By.XPATH, '//a[@class="deck" and contains(text(), "Animals")]')
    #     wait_for_element(self.selenium, By.XPATH, '//a[@class="deck" and contains(text(), "Food")]')

    def test_collection_create_and_edit_card(self):
        self.login(self.selenium)

        collection_link = wait_for_element(self.selenium, By.XPATH, '//a[@href="/collection"]')
        collection_link.click()

        grammar_class_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="grammar-class-field"]')
        easiness_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="easiness-field"]')
        front_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="front-field"]')
        front_extra_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="front-extra-field"]')
        back_main_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="back-main-field"]')
        back_alt_1_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="back-alt-1-field"]')
        back_alt_2_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="back-alt-2-field"]')
        deck_field = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//*[@id="deck-field"]')

        grammar_class_field.send_keys('Verb')
        easiness_field.send_keys('Challenging')
        front_field.send_keys('cuire/faire cuire')
        front_extra_field.send_keys('qqch.')
        back_main_field.send_keys('to cook')
        back_alt_1_field.send_keys('to bake')
        back_alt_2_field.send_keys('to roast')
        deck_field.send_keys('Food')

        submit_btn = wait_for_element(self.selenium, By.XPATH, '//section[@id="card-form-section"]//input[@type="submit" and @value="create"]')
        submit_btn.click()

        deck_food = wait_for_element(self.selenium, By.XPATH, '//a[@class="deck" and contains(text(), "Food")]')
        deck_food.click()

        card = wait_for_element(self.selenium, By.XPATH, '//a[@class="card" and contains(text(), "cuire")]')
        card.click()

        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="grammar-class-field"]//option[contains(text(), "Verb")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="easiness-field"]//option[contains(text(), "Challenging")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="front-field" and contains(text(), "cuire/faire cuire")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="front-extra-field" and contains(text(), "qqch.")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="back-main-field" and contains(text(), "to cook")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="back-alt-1-field" and contains(text(), "to bake")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="back-alt-2-field" and contains(text(), "to roast")]')
        # wait_for_element(self.selenium, By.XPATH, '//section[@id="edit-section"]//*[@id="deck-field"]//option[contains(text(), "Food")]')

        time.sleep(3)

    def tearDown(self):
        self.selenium.quit()
        super().tearDown()