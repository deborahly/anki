document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        displayInitialPlay();

        const deck_id = element.dataset.id;
        
        const fetchDeck = async (deck_id) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/retrieve/?id=${deck_id}`);
                const data = await response.json();
                cards = await data.cards;
                playDeck(cards, 0);
            } catch (error) {
                console.error(error);
            } 
        }
        fetchDeck(deck_id);
    })
});

function displayInitialPlay() {
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';
    
    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';
    
    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'none';
}

function playDeck(cards, index) {    
    let message = document.getElementById('message');
        message.innerHTML = '';

    if (cards.length === 0) {
        message.innerHTML = 'This deck is empty.';
        // alert('This deck is empty.');
    } else {
        showCard(cards, index);
    
        // Clear out button section:  
        const btn_section = document.getElementById('btn-section');
        btn_section.innerHTML = '';
    
        // If card 1 of cards:
        if (index === 0 && cards.length > 1) {
                addNextBtn();
                
                const next_btn = document.getElementById('next-btn');
                next_btn.addEventListener('click', () => {
                    index++;
                    playDeck(cards, index);
                }, {once: true});
        } else {
            // If last card of cards:
            if (index !== 0 && index === cards.length - 1) {
                addPreviousBtn();
                
                const previous_btn = document.getElementById('previous-btn');
                previous_btn.addEventListener('click', () => {
                    index--;
                    playDeck(cards, index);
                }, {once: true});     
            } else {
                // Card x of cards:
                if (index !== 0 && index !== cards.length - 1) {
                    addPreviousBtn();
                    addNextBtn();
    
                    const previous_btn = document.getElementById('previous-btn');
                    previous_btn.addEventListener('click', () => {
                        index--;
                        playDeck(cards, index);
                    }, {once: true});
    
                    const next_btn = document.getElementById('next-btn');
                    next_btn.addEventListener('click', () => {
                        index++;
                        playDeck(cards, index);
                    }, {once: true});
                }
            }
        }
    
        // Add edit and delete button for all cards:
        addEditBtn();
        const edit_btn = document.getElementById('edit-btn');
        edit_btn.addEventListener('click', () => {
            // Adjust page display:
            document.getElementById('card-section').innerHTML = '';
            document.getElementById('btn-section').innerHTML = '';
            editCard(cards, index);
        })
    
        addDeleteBtn();
        const delete_btn = document.getElementById('delete-btn');
        delete_btn.addEventListener('click', () => {
            var result = confirm('Are you sure to delete?');
            if (result) {
                deleteCard(cards, index);
            }
        })
    }
}

function showCard(cards, index) {
    // Clean card section
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';

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
        showCardBack(cards, index);
        addEasinessBtn(cards, index);
    }, {once: true});
}

function showCardBack(cards, index) {
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

    // // Add easiness btns:
    // addEasinessBtn(cards, index);

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        // showCard(cards, index);
        playDeck(cards, index);
    }, {once: true});
}

function addPreviousBtn() {
    const previous_btn = document.createElement('button');
    previous_btn.id = 'previous-btn';
    previous_btn.setAttribute('type', 'button');
    previous_btn.innerHTML = 'Previous card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(previous_btn);
}

function addNextBtn() {
    const next_btn = document.createElement('button');
    next_btn.id = 'next-btn';
    next_btn.setAttribute('type', 'button');
    next_btn.innerHTML = 'Next card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(next_btn);
}

function addEditBtn() {
    const edit_btn = document.createElement('button');
    edit_btn.id = 'edit-btn';
    edit_btn.setAttribute('type', 'button');
    edit_btn.innerHTML = 'Edit card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(edit_btn);
}

function addDeleteBtn() {
    const delete_btn = document.createElement('button');
    delete_btn.id = 'delete-btn';
    delete_btn.setAttribute('type', 'button');
    delete_btn.innerHTML = 'Delete card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(delete_btn);
}

function addEasinessBtn(cards, index) {
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
            updateEasiness(easiness, cards, index);
        })
    })
}

function editCard(cards, index) {
    // Display form section:
    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'block';

    // Pre-fill form with current data:
    document.getElementById('grammar-class-field').value = cards[index]['grammar_class'];
    document.getElementById('easiness-field').value = cards[index]['easiness'];
    document.getElementById('front-field').value = cards[index]['front'];
    document.getElementById('front-extra-field').value = cards[index]['front_extra'];
    document.getElementById('back-main-field').value = cards[index]['back_main'];
    document.getElementById('back-alt-1-field').value = cards[index]['back_alt_1'];
    document.getElementById('back-alt-2-field').value = cards[index]['back_alt_2'];
    document.getElementById('deck-field').value = cards[index]['deck'];

    // Get form:
    const form = document.getElementById('basic-card-form');

    form.onsubmit = async (event) => {
        event.preventDefault();
        
        const csrftoken = getCookie('csrftoken');
        
        const id_field = document.getElementById('id-field')
        id_field.value = cards[index]['id'];
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
            cards[index] = await data.card;

            // Hide form section:
            const edit_section = document.getElementById('edit-section');
            edit_section.style.display = 'none';

            playDeck(cards, index);
        } catch (error) {
            console.error(error);
        }
    }
}

function deleteCard(cards, index) {
    const csrftoken = getCookie('csrftoken');
    
    const newDeck = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/delete/card`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: cards[index]['id']})
            })
            if (response.ok) {
                cards.splice(index, 1);
                if (index > 1) {
                    playDeck(cards, (index-1));
                } else {
                    // Clear out:  
                    const card_section = document.getElementById('card-section');
                    card_section.innerHTML = '';
                    const btn_section = document.getElementById('btn-section');
                    btn_section.innerHTML = '';
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    newDeck();        
}

function updateEasiness(easiness, cards, index) {
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
                if (index < (cards.length - 1)) {
                    playDeck(cards, (index + 1));
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