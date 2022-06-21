from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True

class CardDeck(TimeStampedModel):
    name =  models.CharField(max_length=16, primary_key=True, verbose_name='File name', editable=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files', editable=False, blank=False, null=False)
    easiness = models.CharField(max_length=16, verbose_name='Overall easiness', editable=True, blank=True, null=True)

    def __str__(self):
        return f'{self.name}'

class BasicCard(TimeStampedModel):
    GRAMMAR_CLASS_CHOICES = (
        ('VERB', 'Verb'),
        ('NOUN', 'Noun'),
        ('ADJECTIF', 'Adjectif'),
        ('ADVERB', 'Adverb'),
        ('OTHER', 'Other')
    )
    EASINESS_CHOICES = (
        ('PIECE OF CAKE', 'Piece of cake!'),
        ('NORMAL', 'Normal'),
        ('CHALLENGING', 'Challenging')
    )
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cards', editable=False, blank=False, null=False)
    grammar_class = models.CharField(max_length=32, choices=GRAMMAR_CLASS_CHOICES, verbose_name='Class', editable=True, blank=False, null=False)
    easiness = models.CharField(max_length=16, choices=EASINESS_CHOICES, verbose_name='Easiness', editable=True, blank=False, null=False, default='NORMAL')
    front = models.CharField(max_length=32, verbose_name='Front', editable=True, blank=False, null=False)
    front_extra = models.CharField(max_length=32, verbose_name='Front-extra', editable=True, blank=True, null=True)
    back_main = models.CharField(max_length=32, verbose_name='Back-main', editable=True, blank=False, null=False)
    back_alt_1 =  models.CharField(max_length=32, verbose_name='Back-alternative 1', editable=True, blank=True, null=True)
    back_alt_2 = models.CharField(max_length=32, verbose_name='Back-alternative 2', editable=True, blank=True, null=True)
    deck = models.ForeignKey(CardDeck, to_field='name', on_delete=models.CASCADE, related_name='content', editable=True, blank=False, null=False, default='Generic')

    def __str__(self):
        return f'{self.front}'

    def serialize(self):
        return {
            'id': self.id,
            'grammar_class': self.grammar_class,
            'easiness': self.easiness,
            'front': self.front,
            'front_extra': self.front_extra,
            'back_main': self.back_main,
            'back_alt_1': self.back_alt_1,
            'back_alt_2': self.back_alt_2,
            'deck': self.deck.name
        }

