from django.shortcuts import get_object_or_404, render
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.urls import reverse
from .models import BasicCard, User, CardDeck
from .forms import BasicCardForm, CardDeckForm

# Create your views here.
def index(request):
    basic_card_form = BasicCardForm
    deck_form = CardDeckForm

    return render(request, 'anki/index.html', {
        'basic_card_form': basic_card_form,
        'deck_form': deck_form
    })

@login_required
def collection(request):
    decks = CardDeck.objects.filter(user=request.user)
    basic_card_form = BasicCardForm
    return render(request, 'anki/collection.html', {
        'decks': decks,
        'basic_card_form': basic_card_form
    })

@login_required
def retrieve(request):
    type = request.GET.get('type', '')
    name = request.GET.get('name', '')
    if type == 'basic':
        deck = CardDeck.objects.get(name=name, user=request.user)
        cards = deck.content.all()
        card_list = []
        for card in cards:
            card_dict = card.serialize()
            card_list.append(card_dict)

        return JsonResponse({'cards': card_list}, status=200)

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
                return HttpResponseRedirect(reverse('index'))
        elif type == 'basic card':
            form = BasicCardForm(request.POST)
            if form.is_valid():
                form.instance.user = request.user
                form.save()
                return HttpResponseRedirect(reverse('index'))

def update_card(request):
    if request.method != 'POST':
        return HttpResponseBadRequest
    else:
        form = BasicCardForm(request.POST)
        id = int(request.POST['id'])
        if form.is_valid():
            card = BasicCard.objects.filter(id=id)
            if card:
                card.update(**form.cleaned_data)
                return JsonResponse({'card': card[0].serialize()})
            else:
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