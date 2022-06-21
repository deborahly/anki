document.addEventListener('DOMContentLoaded', function() {
    // When COLLECTION page is loaded:
    if (document.title === 'Collection') {
        // Show deck when selected:
        document.querySelectorAll('.deck').forEach(deck => {
            deck.addEventListener('click', event => {                
                const name = deck.innerHTML;
                
                const fetchDeck = async (name) => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/retrieve/?type=basic&name=${name}`);
                        const data = await response.json();
                        deck = await data.cards;
                        showDeck(deck, 0);
                    } catch (error) {
                        console.error(error);
                    } 
                }
                fetchDeck(name);
            })
        }); 
    }
})

function showDeck(deck, index) {    
    showCard(deck[index]);
    
    // Clear out button section:  
    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';

    // If card 1 of cards:
    if (index === 0 && deck.length > 1) {
            addNextBtn();
            
            const next_btn = document.getElementById('next-btn');
            next_btn.addEventListener('click', () => {
                index++;
                showDeck(deck, index);
            }, {once: true});
    } else {
        // If last card of cards:
        if (index !== 0 && index === deck.length - 1) {
            addPreviousBtn();
            
            const previous_btn = document.getElementById('previous-btn');
            previous_btn.addEventListener('click', () => {
                index--;
                showDeck(deck, index);
            }, {once: true});     
        } else {
            // Card x of cards:
            if (index !== 0 && index !== deck.length - 1) {
                addPreviousBtn();
                addNextBtn();

                const previous_btn = document.getElementById('previous-btn');
                previous_btn.addEventListener('click', () => {
                    index--;
                    showDeck(deck, index);
                }, {once: true});

                const next_btn = document.getElementById('next-btn');
                next_btn.addEventListener('click', () => {
                    index++;
                    showDeck(deck, index);
                }, {once: true});
            }
        }
    }

    // Add edit and delete button for all cards:
    addEditBtn();
    const edit_btn = document.getElementById('edit-btn');
    edit_btn.addEventListener('click', () => {
        editCard(deck, index);
    })
}

function showCard(card) {
    // Clean card section
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';

    // Create card front:
    const card_front = document.createElement('div');
    card_front.classList.add('card');
    card_front.dataset.side = 'front';

    // Create elements:
    const grammar_class = document.createElement('div');
    grammar_class.innerHTML = card['grammar_class'];
    grammar_class.classList.add('grammar-class');

    const front = document.createElement('div');
    front.innerHTML = card['front'];
    front.classList.add('front');

    const front_extra = document.createElement('div');
    front_extra.innerHTML = card['front_extra'];
    front_extra.classList.add('front-extra');

    // Append everything:
    card_section.append(card_front);
    card_front.append(grammar_class);
    card_front.append(front);
    card_front.append(front_extra);

    // Add event listener to turn card when clicked:
    card_front.addEventListener('click', () => {
        showCardBack(card);
    }, {once: true});
}

function showCardBack(card) {
    // Clean card section
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';
        
    // Create card back:
    const card_back = document.createElement('div');
    card_back.classList.add('card');
    card_back.dataset.side = 'back';

    // Create elements:
    const back_main = document.createElement('div');
    back_main.innerHTML = card['back_main'];
    back_main.classList.add('back-main')

    const back_alt_1 = document.createElement('div');
    back_alt_1.innerHTML = card['back_alt_1'];
    back_alt_1.classList.add('back-alt-1')

    const back_alt_2 = document.createElement('div');
    back_alt_2.innerHTML = card['back_alt_2'];
    back_alt_2.classList.add('back-alt-2')

    // Append everything:
    card_section.append(card_back);
    card_back.append(back_main);
    card_back.append(back_alt_1);
    card_back.append(back_alt_2);

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        showCard(card);
    }, {once: true});
}

function addPreviousBtn() {
    const previous_btn = document.createElement('button');
    previous_btn.id = 'previous-btn';
    previous_btn.innerHTML = 'Previous card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(previous_btn);
}

function addNextBtn() {
    const next_btn = document.createElement('button');
    next_btn.id = 'next-btn';
    next_btn.innerHTML = 'Next card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(next_btn);
}

function addEditBtn() {
    const edit_btn = document.createElement('button');
    edit_btn.id = 'edit-btn';
    edit_btn.innerHTML = 'Edit card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(edit_btn);
}

function editCard(deck, index) {
    // Adjust page display:
    document.getElementById('card-section').innerHTML = '';
    document.getElementById('btn-section').innerHTML = '';

    // Display form section:
    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'block';

    // Pre-fill form with current data:
    document.getElementById('grammar-class-field').value = deck[index]['grammar_class'];
    document.getElementById('easiness-field').value = deck[index]['easiness'];
    document.getElementById('front-field').value = deck[index]['front'];
    document.getElementById('front-extra-field').value = deck[index]['front_extra'];
    document.getElementById('back-main-field').value = deck[index]['back_main'];
    document.getElementById('back-alt-1-field').value = deck[index]['back_alt_1'];
    document.getElementById('back-alt-2-field').value = deck[index]['back_alt_2'];
    document.getElementById('deck-field').value = deck[index]['deck'];

    // Get form:
    const form = document.getElementById('basic-card-form');
    // form.append('id', `${deck[index]['id']}`)

    form.onsubmit = async (event) => {
        event.preventDefault();
        const csrftoken = getCookie('csrftoken');
        const id_field = document.getElementById('id-field')
        id_field.value = deck[index]['id'];
        id_field.name = 'id';

        try {
            const response = await fetch(`http://127.0.0.1:8000/update/card`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                body: new FormData(form)
            })
            const data = await response.json();
            deck[index] = await data.card;
            showDeck(deck, index);
        } catch (error) {
            console.error(error);
        }
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}