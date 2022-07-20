import json
from django.shortcuts import render
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.urls import reverse
from .models import BasicCard, User, CardDeck
from .forms import BasicCardForm, CardDeckForm
from django.core.paginator import Paginator


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
def retrieve_session(request):
    id = request.GET.get('id', '')
    try:
        quantity = int(request.GET.get('quantity', ''))
    except ValueError:
        return HttpResponseBadRequest

    deck = CardDeck.objects.get(pk=id, user=request.user)

    card_list = []
    q = BasicCard.objects.filter(user=request.user, deck=deck).order_by('updated_at')[:(quantity)]
    for card in q:
        card_dict = card.serialize()
        card_list.append(card_dict)
    # quantity_normal = int(0.50 * quantity)
    # card_list = []
    # q1 = BasicCard.objects.filter(grade='NORMAL', user=request.user, deck=deck).order_by('updated_at')[:(quantity_normal)]
    # remainder = quantity - q1.count()
    # for card in q1:
    #     card_dict = card.serialize()
    #     card_list.append(card_dict)
    # q2 = BasicCard.objects.filter(grade='CHALLENGING', user=request.user, deck=deck).order_by('updated_at')[:(remainder/2)]
    # remainder = remainder - q2.count()
    # for card in q2:
    #     card_dict = card.serialize()
    #     card_list.append(card_dict)
    # q3 = BasicCard.objects.filter(grade='PIECE OF CAKE', user=request.user, deck=deck).order_by('updated_at')[:(remainder)]
    # for card in q3:
    #     card_dict = card.serialize()
    #     card_list.append(card_dict)

    # if (len(card_list) < quantity):
    #     q4 = BasicCard.objects.filter(user=request.user, deck=deck).order_by('updated_at')
    #     for card in q4:
    #         if (len(card_list) < quantity) and (card not in q1) and (card not in q2) and (card not in q3):
    #             card_dict = card.serialize()
    #             card_list.append(card_dict)
    
    deck = deck.serialize()

    return JsonResponse({
        'cards': card_list,
        'deck': deck
        }, status=200)

@login_required
def retrieve_batch(request):
    id = request.GET.get('id', '')
    page = request.GET.get('page', '')
    per_page = request.GET.get('per-page', '')
    
    deck = CardDeck.objects.get(pk=id, user=request.user)
    cards = deck.content.all()
    # Add paginator:
    paginator = Paginator(cards, per_page)
    page_object = paginator.get_page(page)
    # Serialize objects:
    cards_on_page = []
    for card in page_object.object_list:
        c = card.serialize()
        cards_on_page.append(c)
    # Serialize deck:
    deck = deck.serialize()
    # Define payload:
    payload = {
        'pagination': {
            'current': page_object.number,
            'has_next': page_object.has_next(),
            'has_previous': page_object.has_previous()
        },
        'cards': cards_on_page,
        'deck': deck
    }

    return JsonResponse(payload, status=200)

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
def grade_card(request): 
    if request.method != 'PUT':
        return HttpResponseBadRequest
    else:
        data = json.loads(request.body)
        id = data.get('id', '')
        grade = data.get('grade', '')
        try:
            card = BasicCard.objects.get(pk=id)
            card.grade = grade
            card.save()

            # Update deck
            deck = card.deck
            deck.grade = deck.grade_average()
            deck.save()

            return JsonResponse({
                'message': 'Card grade updated'
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