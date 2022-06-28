document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        displayInitialPlay();

        // Get deck id:
        const deck_id = element.dataset.id;
        
        // Show options if deck is not empty:
        const checkDeck = async () => {
            try {
                const response = await fetchDeck(deck_id);
                const cards = response['cards'];          
                if (cards.length === 0) {
                    message.innerHTML = 'This deck is empty.'; 
                } else {
                    const option_section = document.getElementById('option-section');
                    option_section.style.display = 'block';

                    // Update quantity:
                    updateQuantity(deck_id);

                    // If quantity is submitted:
                    const quantity_form = document.getElementById('quantity-form');
                    
                    quantity_form.onsubmit = async (event) => {
                        event.preventDefault();
                        const quantity = document.getElementById('quantity').value;
                        showCard(cards, 0, quantity);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        checkDeck();
    })
});

function displayInitialPlay() {
    const message = document.getElementById('message');
    message.innerHTML = '';

    const option_section = document.getElementById('option-section');
    option_section.style.display = 'none';
    
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';
    
    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';
}

async function fetchDeck(deck_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/retrieve/?id=${deck_id}`);
        const data = await response.json();
        deck = await data.deck;
        cards = await data.cards;
        const response_dict = {
            'deck': deck,
            'cards': cards
        }
        return response_dict
    } catch (error) {
        console.error(error);
    } 
}

function showCard(cards, index, quantity) {
    displayInitialPlay();

    const card_section = document.getElementById('card-section');

    // Create card front:
    const card_front = document.createElement('div');
    card_front.classList.add('card');
    card_front.dataset.side = 'front';

    // Create elements:
    const grammar_class = document.createElement('div');
    grammar_class.innerHTML = cards[index]['grammar_class'];
    grammar_class.classList.add('grammar-class');

    const front = document.createElement('div');
    front.innerHTML = cards[index]['front'];
    front.classList.add('front');

    const front_extra = document.createElement('div');
    front_extra.innerHTML = cards[index]['front_extra'];
    front_extra.classList.add('front-extra');

    // Append everything:
    card_section.append(card_front);
    card_front.append(grammar_class);
    card_front.append(front);
    card_front.append(front_extra);

    // Add event listener to turn card when clicked:
    card_front.addEventListener('click', () => {
        showCardBack(cards, index, quantity);
        addEasinessBtn(cards, index, quantity);
    }, {once: true});
}

function showCardBack(cards, index, quantity) {
    // Clean card section
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';
        
    // Create card back:
    const card_back = document.createElement('div');
    card_back.classList.add('card');
    card_back.dataset.side = 'back';

    // Create elements:
    const back_main = document.createElement('div');
    back_main.innerHTML = cards[index]['back_main'];
    back_main.classList.add('back-main')

    const back_alt_1 = document.createElement('div');
    back_alt_1.innerHTML = cards[index]['back_alt_1'];
    back_alt_1.classList.add('back-alt-1')

    const back_alt_2 = document.createElement('div');
    back_alt_2.innerHTML = cards[index]['back_alt_2'];
    back_alt_2.classList.add('back-alt-2')

    // Append everything:
    card_section.append(card_back);
    card_back.append(back_main);
    card_back.append(back_alt_1);
    card_back.append(back_alt_2);

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        showCard(cards, index, quantity);
    }, {once: true});
}

function addEasinessBtn(cards, index, quantity) {
    const cake_btn = document.createElement('button');
    cake_btn.id = 'cake-btn';
    cake_btn.dataset.value = 'PIECE OF CAKE';
    cake_btn.setAttribute('type', 'button');
    cake_btn.innerHTML = 'Piece of cake!';

    const normal_btn = document.createElement('button');
    normal_btn.id = 'normal-btn';
    normal_btn.dataset.value = 'NORMAL';
    normal_btn.setAttribute('type', 'button');
    normal_btn.innerHTML = 'Normal';

    const challenging_btn = document.createElement('button');
    challenging_btn.id = 'challenging-btn';
    challenging_btn.dataset.value = 'CHALLENGING';
    challenging_btn.setAttribute('type', 'button');
    challenging_btn.innerHTML = 'Challenging';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(cake_btn);
    btn_section.append(normal_btn);
    btn_section.append(challenging_btn);

    [cake_btn, normal_btn, challenging_btn].forEach(element => {
        element.addEventListener('click', (event) => {
            const easiness = event.target.dataset.value;
            updateEasiness(easiness, cards, index, quantity);
        })
    })
}

function updateEasiness(easiness, cards, index, quantity) {
    const csrftoken = getCookie('csrftoken');
    
    const fetchCardEasiness = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/easiness/card', {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: cards[index]['id'], easiness: easiness})
            })
            if (response.ok) {
                if (index < (quantity - 1) && index < (cards.length - 1)) {
                    showCard(cards, (index + 1), quantity);
                } else {
                    // Clear out card section and btn section:  
                    const card_section = document.getElementById('card-section');
                    card_section.innerHTML = '';
                    const btn_section = document.getElementById('btn-section');
                    btn_section.innerHTML = '';
                    // Show message
                    let message = document.getElementById('message');
                    message.innerHTML = 'Congratulations! You finished this session!'
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchCardEasiness();        
}

function updateQuantity(deck_id) {
    const fetchCardQuantity = async () => {
        try {
            const response = await fetchDeck(deck_id);
            const cards = response['cards'];
            let cards_max = cards.length;
            let max = document.getElementById('quantity');
            max.setAttribute('max', `${cards_max}`);
        } catch (error) {
            console.error(error);
        }
    }
    fetchCardQuantity();
}