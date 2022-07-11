from django import forms
from .models import BasicCard, CardDeck

class BasicCardForm(forms.ModelForm):
    class Meta:
        model = BasicCard
        fields = ['grammar_class', 'grade', 'front', 'front_extra', 'back_main', 'back_alt_1', 'back_alt_2', 'deck']
        widgets = {
            'grammar_class': forms.Select(attrs={'id': 'grammar-class-field'}),
            'grade': forms.Select(attrs={'id': 'grade-field'}),
            'front': forms.TextInput(attrs={'id': 'front-field'}),
            'front_extra': forms.TextInput(attrs={'id': 'front-extra-field'}),
            'back_main': forms.TextInput(attrs={'id': 'back-main-field'}),
            'back_alt_1': forms.TextInput(attrs={'id': 'back-alt-1-field'}),
            'back_alt_2': forms.TextInput(attrs={'id': 'back-alt-2-field'}),
            'deck': forms.Select(attrs={'id': 'deck-field'}),
        }
    
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(BasicCardForm, self).__init__(*args, **kwargs)
        decks = CardDeck.objects.filter(archived=False, user=user)
        tuple = ()
        for deck in decks:
            l = []
            l.append(deck.id)
            l.append(deck.name)
            t = (*l,)
            tuple = tuple + (t,)
        self.fields['deck'].choices = tuple

    # def __init__(self, *args, **kwargs):
    #     user = kwargs.pop('user', None)
    #     super(BasicCardForm, self).__init__(*args, **kwargs)
    #     self.fields['deck'].queryset = CardDeck.objects.filter(archived=False, user=user)

class CardDeckForm(forms.ModelForm):
    class Meta:
        model = CardDeck
        fields = ['name']