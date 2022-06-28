import json
from django.shortcuts import render
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.urls import reverse
from .models import BasicCard, User, CardDeck
from .forms import BasicCardForm, CardDeckForm


def index(request):
    return render(request, 'anki/index.html')

@login_required
def play(request):
    decks = CardDeck.objects.filter(user=request.user, archived=False)
    basic_card_form = BasicCardForm(user=request.user)
    return render(request, 'anki/play.html', {
        'decks': decks,
        'basic_card_form': basic_card_form
    })

@login_required
def collection(request):
    decks = CardDeck.objects.filter(user=request.user, archived=False)
    basic_card_form = BasicCardForm(user=request.user)
    deck_form = CardDeckForm
    return render(request, 'anki/collection.html', {
        'decks': decks,
        'basic_card_form': basic_card_form,
        'deck_form': deck_form
    })

@login_required
def retrieve(request):
    id = request.GET.get('id', '')
    deck = CardDeck.objects.get(pk=id, user=request.user)
    cards = deck.content.all()
    card_list = []
    for card in cards:
        card_dict = card.serialize()
        card_list.append(card_dict)
    deck = deck.serialize()

    return JsonResponse({
        'cards': card_list,
        'deck': deck
        }, status=200)

@login_required
def create(request, type):
    if request.method != 'POST':
        return HttpResponseBadRequest
    else:
        if type == 'deck':
            form = CardDeckForm(request.POST)
            if form.is_valid():
                form.instance.user = request.user
                form.save()
                return HttpResponseRedirect(reverse('collection'))
            else:
                return Http404
        elif type == 'basic card':
            form = BasicCardForm(request.POST, user=request.user)
            if form.is_valid():
                form.instance.user = request.user
                form.save()
                return JsonResponse({
                    'message': 'Card created'
                    }, status=200)
                # return HttpResponseRedirect(reverse('collection'))
            else:
                return Http404

@login_required
def update_card(request):
    if request.method != 'POST':
        return HttpResponseBadRequest
    else:
        form = BasicCardForm(request.POST, user=request.user)
        id = int(request.POST['id'])
        if form.is_valid():
            card = BasicCard.objects.filter(id=id)
            if card:
                card.update(**form.cleaned_data)
                return JsonResponse({'card': card[0].serialize()})
            else:
                return Http404
        else:
            return Http404

@login_required
def delete_card(request):
    if request.method != 'POST':
        return HttpResponseBadRequest
    else:
        data = json.loads(request.body)
        id = data.get('id', '')
        try:
            card = BasicCard.objects.get(pk=id)
            card.delete()
            return JsonResponse({
                'message': 'Card deleted'
            }, status=200)
        except:
            return Http404

@login_required
def easiness_card(request): 
    if request.method != 'PUT':
        return HttpResponseBadRequest
    else:
        data = json.loads(request.body)
        id = data.get('id', '')
        easiness = data.get('easiness', '')
        try:
            card = BasicCard.objects.get(pk=id)
            card.easiness = easiness
            card.save()
            return JsonResponse({
                'message': 'Card easiness updated'
            }, status=200)
        except:
            return Http404

@login_required
def archive(request):
    if request.method == 'POST':
        id = request.POST['deck-to-archive']
        try:
            deck = CardDeck.objects.get(pk=id)
            deck.archived = True
            deck.save()
            return HttpResponseRedirect(reverse('archive'))
        except:
            return Http404
    
    archived_decks = CardDeck.objects.filter(user=request.user, archived=True)
    return render(request, 'anki/archive.html', {
        'archived_decks': archived_decks
    })

@login_required
def unarchive(request):
    if request.method == 'POST':
        id = request.POST['deck-to-unarchive']
        try:
            deck = CardDeck.objects.get(pk=id)
            deck.archived = False
            deck.save()
            return HttpResponseRedirect(reverse('collection'))
        except:
            return Http404
#     if request.method != 'POST':
#         return HttpResponseBadRequest
#     else:
#         data = json.loads(request.body)
#         id = data.get('deck_id', '')
#         try:
#             deck = CardDeck.objects.get(pk=id)
#             deck.archived = False
#             deck.save()
#             return JsonResponse({
#                 'message': 'Deck unarchived'
#             }, status=200)
#         except:
#             return Http404

@login_required
def delete_deck(request):
    if request.method != 'POST':
        return HttpResponseBadRequest
    else:
        data = json.loads(request.body)
        id = data.get('deck_id', '')
        try:
            deck = CardDeck.objects.get(pk=id)
            deck.delete()
            return JsonResponse({
                'message': 'Deck deleted'
            }, status=200)
        except:
            return Http404

def login_view(request):
    if request.method == 'POST':
        # Attempt to sign user in:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful:
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'anki/login.html', {
                'message': 'Invalid username and/or password.'
            })
    else:
        return render(request, 'anki/login.html')

def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']

        # Ensure password matches confirmation
        password = request.POST['password']
        confirmation = request.POST['confirmation']
        if password != confirmation:
            return render(request, 'anki/register.html', {
                'message': 'Passwords must match.'
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, 'anki/register.html', {
                'message': 'Username already taken.'
            })
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'anki/register.html')

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))