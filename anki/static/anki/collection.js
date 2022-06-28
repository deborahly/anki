document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {
        // Clear out:
        displayInitialCollection();
        
        // Get deck id and show options:
        const deck_id = element.dataset.id;
        const deck_name = element.innerHTML;
        showOptions(deck_id, deck_name);
    })
});

function displayInitialCollection() {
    const message = document.getElementById('message');
    message.innerHTML = '';
    
    const option_nav = document.getElementById('option-nav');
    option_nav.innerHTML = '';

    const option_area = document.getElementById('option-area');
    option_area.innerHTML = '';

    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';

    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'none';

    const card_form_section = document.getElementById('card-form-section');
    card_form_section.style.display = 'none';
}

function displayInitialOptions() {
    const option_area = document.getElementById('option-area');
    option_area.innerHTML = '';

    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';

    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'none';

    const card_form_section = document.getElementById('card-form-section');
    card_form_section.style.display = 'none';
}

function showOptions(deck_id, deck_name) {
    displayInitialCollection();

    const option_nav = document.getElementById('option-nav');
    const option_list = document.createElement('ul');

    const deck_info_li = document.createElement('li');
    const deck_info_a = document.createElement('a');
    deck_info_a.setAttribute('href', '#');
    deck_info_a.innerHTML = 'Deck info';
    deck_info_li.append(deck_info_a);

    const list_deck_li = document.createElement('li');
    const list_deck_a = document.createElement('a');
    list_deck_a.setAttribute('href', '#');
    list_deck_a.innerHTML = 'List deck';
    list_deck_li.append(list_deck_a);

    const view_cards_li = document.createElement('li');
    const view_cards_a = document.createElement('a');
    view_cards_a.setAttribute('href', '#');
    view_cards_a.innerHTML = 'View cards one-by-one';
    view_cards_li.append(view_cards_a);

    const create_card_li = document.createElement('li');
    const create_card_a = document.createElement('a');
    create_card_a.setAttribute('href', '#');
    create_card_a.innerHTML = 'Create new card';
    create_card_li.append(create_card_a);

    option_nav.append(option_list);
    option_list.append(deck_info_li);
    option_list.append(list_deck_li);
    option_list.append(view_cards_li);
    option_list.append(create_card_li);

    deck_info_a.addEventListener('click', () => {
        const getInfo = async () => {
            displayInitialOptions();
            const option_area = document.getElementById('option-area');
            option_area.innerHTML = '';
            const response = await fetchDeck(deck_id);
            showInfo(response['deck'], response['cards']);
        }
        getInfo();
    })

    list_deck_a.addEventListener('click', () => {
        const getList = async () => {
            displayInitialOptions();
            const option_area = document.getElementById('option-area');
            option_area.innerHTML = '';
            const response = await fetchDeck(deck_id);
            listDeck(response['deck'], response['cards']);
        }
        getList();
    })

    view_cards_a.addEventListener('click', () => {
        const getCards = async () => {
            displayInitialOptions();
            const option_area = document.getElementById('option-area');
            option_area.innerHTML = '';
            const response = await fetchDeck(deck_id);
            showDeck(response['cards'], 0);
        }
        getCards();
    })

    create_card_a.addEventListener('click', () => {
        displayInitialOptions();
        const card_form_section = document.getElementById('card-form-section');
        card_form_section.style.display = 'block';
        let deck_field = getElementByXpath('//*[@id="card-form-section"]//select[@id="deck-field"]');
        deck_field.value = deck_id;

        const form = getElementByXpath('//*[@id="card-form-section"]//form[@id="basic-card-form"]');
        form.onsubmit = async (event) => {
            event.preventDefault();
            createCard(form);
        }
    })
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
    // const fetchDeck = async (deck_id) => {
    //     try {
    //         const response = await fetch(`http://127.0.0.1:8000/retrieve/?id=${deck_id}`);
    //         const data = await response.json();
    //         deck = await data.deck;
    //         cards = await data.cards;
    //         const response_dict = {
    //             'deck': deck,
    //             'cards': cards
    //         }
    //         return response_dict
    //     } catch (error) {
    //         console.error(error);
    //     } 
    // }
    // fetchDeck(deck_id);
}

function showInfo(deck, cards) {
    const option_area = document.getElementById('option-area');

    const total_cards = document.createElement('div');
    total_cards.innerHTML = `Total cards: ${cards.length}`;

    option_area.append(total_cards);
}

function listDeck(deck, cards) { 
    if (cards.length === 0) {
        let message = document.getElementById('message');
        message.innerHTML = 'This deck is empty.'
        // updateArchiveForm(deck['id']);
    } else {
        const option_area = document.getElementById('option-area');

        const list_header = document.createElement('div');
        list_header.id = 'list-header';
        option_area.append(list_header);
    
        const list_name = document.createElement('h5');
        list_name.innerHTML = deck['name'];
        list_header.append(list_name);
    
        const list = document.createElement('ol');
        option_area.append(list);
        
        for (let i = 0; i < cards.length; i++) {
            let list_element = document.createElement('li');
    
            let list_link = document.createElement('a');
            list_link.classList.add('card');
            list_link.setAttribute('href', '#');
            list_link.innerHTML = `${cards[i]['front']}`
    
            list_element.append(list_link);
            list.append(list_element);
    
            list_element.addEventListener('click', (event) => {
                event.preventDefault();
                showDeck(cards, i);
            })
        }
        // updateArchiveForm(deck['id']);
    }
}

// function updateArchiveForm(deck_id) {
    // Display form section:
    // const archive_section = document.getElementById('archive-section');
    // archive_section.style.display = 'block';
    // Inform deck to be archived:
//     const deck_to_archive = document.getElementById('deck-to-archive');
//     deck_to_archive.value = deck_id;
// }

function showDeck(cards, index) {    
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
                    showDeck(cards, index);
                }, {once: true});
        } else {
            // If last card of cards:
            if (index !== 0 && index === cards.length - 1) {
                addPreviousBtn();
                
                const previous_btn = document.getElementById('previous-btn');
                previous_btn.addEventListener('click', () => {
                    index--;
                    showDeck(cards, index);
                }, {once: true});     
            } else {
                // Card x of cards:
                if (index !== 0 && index !== cards.length - 1) {
                    addPreviousBtn();
                    addNextBtn();
    
                    const previous_btn = document.getElementById('previous-btn');
                    previous_btn.addEventListener('click', () => {
                        index--;
                        showDeck(cards, index);
                    }, {once: true});
    
                    const next_btn = document.getElementById('next-btn');
                    next_btn.addEventListener('click', () => {
                        index++;
                        showDeck(cards, index);
                    }, {once: true});
                }
            }
        }
    
        // Add edit and delete button for all cards:
        addEditBtn();
        const edit_btn = document.getElementById('edit-btn');
        edit_btn.addEventListener('click', () => {
            // Adjust page display:
            document.getElementById('option-area').innerHTML = '';
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
    const option_area = document.getElementById('option-area');
    option_area.innerHTML = '';

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
    option_area.append(card_front);
    card_front.append(grammar_class);
    card_front.append(front);
    card_front.append(front_extra);

    // Add event listener to turn card when clicked:
    card_front.addEventListener('click', () => {
        showCardBack(cards, index);
        // addEasinessBtn(cards, index);
    }, {once: true});
}

function showCardBack(cards, index) {
    // Clean card section
    const option_area = document.getElementById('option-area');
    option_area.innerHTML = '';
        
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
    option_area.append(card_back);
    card_back.append(back_main);
    card_back.append(back_alt_1);
    card_back.append(back_alt_2);

    // // Add easiness btns:
    // addEasinessBtn(cards, index);

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        // showCard(cards, index);
        showDeck(cards, index);
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

function editCard(cards, index) {
    // Display form section:
    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'block';

    // Pre-fill form with current data:
    // document.getElementById('grammar-class-field').value = cards[index]['grammar_class'];
    // document.getElementById('easiness-field').value = cards[index]['easiness'];
    // document.getElementById('front-field').value = cards[index]['front'];
    // document.getElementById('front-extra-field').value = cards[index]['front_extra'];
    // document.getElementById('back-main-field').value = cards[index]['back_main'];
    // document.getElementById('back-alt-1-field').value = cards[index]['back_alt_1'];
    // document.getElementById('back-alt-2-field').value = cards[index]['back_alt_2'];
    // document.getElementById('deck-field').value = cards[index]['deck'];

    let grammar_class_field = getElementByXpath('//*[@id="edit-section"]//select[@id="grammar-class-field"]');
    grammar_class_field.value = cards[index]['grammar_class'];
    let easiness_field = getElementByXpath('//*[@id="edit-section"]//select[@id="easiness-field"]');
    easiness_field.value = cards[index]['easiness'];
    let front_field = getElementByXpath('//*[@id="edit-section"]//input[@id="front-field"]');
    front_field.value = cards[index]['front'];
    let front_extra_field = getElementByXpath('//*[@id="edit-section"]//input[@id="front-extra-field"]');
    front_extra_field.value = cards[index]['front_extra'];
    let back_main_field = getElementByXpath('//*[@id="edit-section"]//input[@id="back-main-field"]');
    back_main_field.value = cards[index]['back_main'];
    let back_alt_1_field = getElementByXpath('//*[@id="edit-section"]//input[@id="back-alt-1-field"]');
    back_alt_1_field.value = cards[index]['back_alt_1'];
    let back_alt_2_field = getElementByXpath('//*[@id="edit-section"]//input[@id="back-alt-2-field"]');
    back_alt_2_field.value = cards[index]['back_alt_2'];
    let deck_field = getElementByXpath('//*[@id="edit-section"]//select[@id="deck-field"]');
    deck_field.value = cards[index]['deck'];

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
            updated_card = await data.card;
            // Update cards
            cards[index] = updated_card;
            // Hide edit form section:
            const edit_section = document.getElementById('edit-section');
            edit_section.style.display = 'none';      
            // Continue showing cards:
            if (index < (cards.length - 1)) {
                showDeck(cards, (index + 1));
            } else {
                // Hide form section:
                const edit_section = document.getElementById('edit-section');
                edit_section.style.display = 'none';
                // Show message
                let message = document.getElementById('message');
                message.innerHTML = 'You reached the end of the deck.'
            }
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
                    showDeck(cards, (index-1));
                } else {
                    // Clear out:  
                    const option_area = document.getElementById('option-area');
                    option_area.innerHTML = '';
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

async function createCard(form) {
    const csrftoken = getCookie('csrftoken');
    try {
        const response = await fetch(`http://127.0.0.1:8000/create/basic%20card`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: new FormData(form)
        })
        // Clean fields:
        let grammar_class_field = getElementByXpath('//*[@id="card-form-section"]//select[@id="grammar-class-field"]');
        grammar_class_field.value = '';
        let easiness_field = getElementByXpath('//*[@id="card-form-section"]//select[@id="easiness-field"]');
        easiness_field.value = '';
        let front_field = getElementByXpath('//*[@id="card-form-section"]//input[@id="front-field"]');
        front_field.value = '';
        let front_extra_field = getElementByXpath('//*[@id="card-form-section"]//input[@id="front-extra-field"]');
        front_extra_field.value = '';
        let back_main_field = getElementByXpath('//*[@id="card-form-section"]//input[@id="back-main-field"]');
        back_main_field.value = '';
        let back_alt_1_field = getElementByXpath('//*[@id="card-form-section"]//input[@id="back-alt-1-field"]');
        back_alt_1_field.value = '';
        let back_alt_2_field = getElementByXpath('//*[@id="card-form-section"]//input[@id="back-alt-2-field"]');
        back_alt_2_field.value = '';
        if (response.ok) {
            // Show message:
            let message = document.getElementById('message');
            message.innerHTML = 'Card successfully created.';
            } else {
                // Show message:
                let message = document.getElementById('message');
                message.innerHTML = 'It was not possible to create the card. Please, try again.';
            }
    } catch (error) {
        console.error(error);
        }
}