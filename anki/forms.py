from django import forms
from .models import BasicCard, CardDeck

class BasicCardForm(forms.ModelForm):
    class Meta:
        model = BasicCard
        fields = ['grammar_class', 'easiness', 'front', 'front_extra', 'back_main', 'back_alt_1', 'back_alt_2', 'deck']
        widgets = {
            'grammar_class': forms.Select(attrs={'id': 'grammar-class-field'}),
            'easiness': forms.Select(attrs={'id': 'easiness-field'}),
            'front': forms.TextInput(attrs={'id': 'front-field'}),
            'front_extra': forms.TextInput(attrs={'id': 'front-extra-field'}),
            'back_main': forms.TextInput(attrs={'id': 'back-main-field'}),
            'back_alt_1': forms.TextInput(attrs={'id': 'back-alt-1-field'}),
            'back_alt_2': forms.TextInput(attrs={'id': 'back-alt-2-field'}),
            'deck': forms.Select(attrs={'id': 'deck-field'}),
        }

class CardDeckForm(forms.ModelForm):
    class Meta:
        model = CardDeck
        fields = ['name']