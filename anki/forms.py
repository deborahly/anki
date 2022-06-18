from django import forms
from .models import BasicCard, CardDeck

class BasicCardForm(forms.ModelForm):
    class Meta:
        model = BasicCard
        fields = ['grammar_class', 'easiness', 'front', 'front_extra', 'back_main', 'back_alt_1', 'back_alt_2', 'deck']

class CardDeckForm(forms.ModelForm):
    class Meta:
        model = CardDeck
        fields = ['name']