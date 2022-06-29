// Constants
const PER_PAGE = 10;

// Globals
var pagination = [];
var cards = [];
var deck = [];
var page_index = 1;

document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {      
        displayInitialCollection();
        
        // Get deck id and show options:
        let deck_id = element.dataset.id;
        showOptions();

        // If deck info is selected:   
        document.getElementById('deck-info-link').addEventListener('click', () => {
            let getInfo = async () => {
                displayInitialOptions();
                
                let option_area = document.getElementById('option-area');
                option_area.innerHTML = '';
                
                let response = await fetchBatch(deck_id);
                deck = response['deck'];
                cards = response['cards'];
                pagination = response['pagination'];
                
                showInfo();
            }
            getInfo();
        })
    
        // If list deck is selected:
        document.getElementById('list-deck-link').addEventListener('click', () => {
            let getList = async () => {
                displayInitialOptions();
                
                let option_area = document.getElementById('option-area');
                option_area.innerHTML = '';
                
                let response = await fetchBatch(deck_id);
                deck = response['deck'];
                cards = response['cards'];
                pagination = response['pagination'];

                if (cards.length != 0) {
                    listBatch();
                } else {
                    let message = document.getElementById('message');
                    message.innerHTML = 'This deck is empty.'
                }
            }
            getList();
        })
    
        // If create card is selected:
        document.getElementById('create-card-link').addEventListener('click', () => {
            displayInitialOptions();
            
            let card_form_section = document.getElementById('card-form-section');
            card_form_section.style.display = 'block';
            
            let deck_field = getElementByXpath('//*[@id="card-form-section"]//select[@id="deck-field"]');
            deck_field.value = deck_id;
    
            let form = getElementByXpath('//*[@id="card-form-section"]//form[@id="basic-card-form"]');
            form.onsubmit = async (event) => {
                event.preventDefault();
                createCard(form);
            }
        })
    })
});

function displayInitialCollection() {
    let message = document.getElementById('message');
    message.innerHTML = '';
  
    let option_nav = document.getElementById('option-nav');
    option_nav.innerHTML = '';

    let option_area = document.getElementById('option-area');
    option_area.innerHTML = '';

    let card_section = document.getElementById('card-section');
    card_section.innerHTML = '';

    let btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';

    let edit_form_section = document.getElementById('edit-form-section');
    edit_form_section.style.display = 'none';

    let card_form_section = document.getElementById('card-form-section');
    card_form_section.style.display = 'none';
}

function displayInitialOptions() {
    let message = document.getElementById('message');
    message.innerHTML = '';

    let option_area = document.getElementById('option-area');
    option_area.innerHTML = '';

    let card_section = document.getElementById('card-section');
    card_section.innerHTML = '';

    let btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';

    let edit_form_section = document.getElementById('edit-form-section');
    edit_form_section.style.display = 'none';

    let card_form_section = document.getElementById('card-form-section');
    card_form_section.style.display = 'none';
}

function showOptions() {
    displayInitialCollection();

    let option_nav = document.getElementById('option-nav');
    let option_list = document.createElement('ul');

    let deck_info_li = document.createElement('li');
    let deck_info_a = document.createElement('a');
    deck_info_a.id = 'deck-info-link';
    deck_info_a.setAttribute('href', '#');
    deck_info_a.innerHTML = 'Deck info';
    deck_info_li.append(deck_info_a);

    let list_deck_li = document.createElement('li');
    let list_deck_a = document.createElement('a');
    list_deck_a.id = 'list-deck-link';
    list_deck_a.setAttribute('href', '#');
    list_deck_a.innerHTML = 'List deck';
    list_deck_li.append(list_deck_a);

    let create_card_li = document.createElement('li');
    let create_card_a = document.createElement('a');
    create_card_a.id = 'create-card-link'
    create_card_a.setAttribute('href', '#');
    create_card_a.innerHTML = 'Create new card';
    create_card_li.append(create_card_a);

    option_nav.append(option_list);
    option_list.append(deck_info_li);
    option_list.append(list_deck_li);
    option_list.append(create_card_li);
}

async function fetchBatch(deck_id) {
    try {
        let response = await fetch(`http://127.0.0.1:8000/retrieve/batch?id=${deck_id}&page=${page_index}&per-page=${PER_PAGE}`);
        let data = await response.json();
        pagination = await data.pagination;
        deck = await data.deck;
        cards = await data.cards;
        let response_dict = {
            'pagination': pagination,
            'deck': deck,
            'cards': cards
        }
        return response_dict
    } catch (error) {
        console.error(error);
    } 
}

function showInfo() {
    let option_area = document.getElementById('option-area');

    let total_cards = document.createElement('div');
    total_cards.innerHTML = `Total cards: `;

    let easiness = document.createElement('div');
    easiness.innerHTML = `Easiness: `;

    option_area.append(total_cards);
    option_area.append(easiness);
}

function listBatch() {
    let option_area = document.getElementById('option-area');

    let list_header = document.createElement('div');
    list_header.id = 'list-header';
    option_area.append(list_header);

    let list_name = document.createElement('h5');
    list_name.innerHTML = deck['name'];
    list_header.append(list_name);

    let list = document.createElement('ol');
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
            showDeck(i);        
        })
    }

    // Display previous/next buttons, when applicable:
    if (pagination.has_previous === false && pagination.has_next === true) {
            let next_btn = document.createElement('button');
            next_btn.setAttribute('type', 'button');
            next_btn.innerHTML = 'Next';
            option_area.append(next_btn);
    } else {
        if (pagination.has_previous === true && pagination.has_next === false) {
            let previous_btn = document.createElement('button');
            previous_btn.setAttribute('type', 'button');
            previous_btn.innerHTML = 'Previous';
            option_area.append(previous_btn);
        } else {
            if (pagination.has_previous === true && pagination.has_next === true) {
                let next_btn = document.createElement('button');
                next_btn.setAttribute('type', 'button');
                next_btn.innerHTML = 'Next';
                option_area.append(next_btn);
    
                let previous_btn = document.createElement('button');
                previous_btn.setAttribute('type', 'button');
                previous_btn.innerHTML = 'Previous';
                option_area.append(previous_btn);
            }
        }
    }
    // Add event listener to previous/next buttons:
    // previous_btn.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     pagination_index++;
    //     let response = await fetchBatch(deck_id, 1, 2);
    //     listBatch();
}

function showDeck(index) {    
    // Adjust page display:
    document.getElementById('card-section').innerHTML = '';
    document.getElementById('btn-section').innerHTML = '';
    
    showCard(index);

    // Add edit and delete button for all cards:
    addEditBtn();
    let edit_btn = document.getElementById('edit-btn');
    edit_btn.addEventListener('click', () => {
        editCard(index);
    })

    addDeleteBtn();
    let delete_btn = document.getElementById('delete-btn');
    delete_btn.addEventListener('click', () => {
        var result = confirm('Are you sure to delete?');
        if (result) {
            deleteCard(index);
        }
    })
}

function showCard(index) {
    // Clean card section
    let card_section = document.getElementById('card-section');
    card_section.innerHTML = '';

    // Create card front:
    let card_front = document.createElement('div');
    card_front.classList.add('card');
    card_front.dataset.side = 'front';

    // Create elements:
    let grammar_class = document.createElement('div');
    grammar_class.innerHTML = cards[index]['grammar_class'];
    grammar_class.classList.add('grammar-class');

    let front = document.createElement('div');
    front.innerHTML = cards[index]['front'];
    front.classList.add('front');

    let front_extra = document.createElement('div');
    front_extra.innerHTML = cards[index]['front_extra'];
    front_extra.classList.add('front-extra');

    // Append everything:
    card_section.append(card_front);
    card_front.append(grammar_class);
    card_front.append(front);
    card_front.append(front_extra);

    // Add event listener to turn card when clicked:
    card_front.addEventListener('click', () => {
        showCardBack(index);
    }, {once: true});
}

function addEditBtn() {
    let edit_btn = document.createElement('button');
    edit_btn.id = 'edit-btn';
    edit_btn.setAttribute('type', 'button');
    edit_btn.innerHTML = 'Edit card';

    let btn_section = document.getElementById('btn-section');
    btn_section.append(edit_btn);
}

function addDeleteBtn() {
    let delete_btn = document.createElement('button');
    delete_btn.id = 'delete-btn';
    delete_btn.setAttribute('type', 'button');
    delete_btn.innerHTML = 'Delete card';

    let btn_section = document.getElementById('btn-section');
    btn_section.append(delete_btn);
}

function editCard(index) {
    // Adjust page display:
    document.getElementById('card-section').innerHTML = '';
    document.getElementById('btn-section').innerHTML = '';
    
    // Display form section:
    let edit_form_section = document.getElementById('edit-form-section');
    edit_form_section.style.display = 'block';

    // Pre-fill form with current data:
    let grammar_class_field = getElementByXpath('//*[@id="edit-form-section"]//select[@id="grammar-class-field"]');
    grammar_class_field.value = cards[index]['grammar_class'];
    let easiness_field = getElementByXpath('//*[@id="edit-form-section"]//select[@id="easiness-field"]');
    easiness_field.value = cards[index]['easiness'];
    let front_field = getElementByXpath('//*[@id="edit-form-section"]//input[@id="front-field"]');
    front_field.value = cards[index]['front'];
    let front_extra_field = getElementByXpath('//*[@id="edit-form-section"]//input[@id="front-extra-field"]');
    front_extra_field.value = cards[index]['front_extra'];
    let back_main_field = getElementByXpath('//*[@id="edit-form-section"]//input[@id="back-main-field"]');
    back_main_field.value = cards[index]['back_main'];
    let back_alt_1_field = getElementByXpath('//*[@id="edit-form-section"]//input[@id="back-alt-1-field"]');
    back_alt_1_field.value = cards[index]['back_alt_1'];
    let back_alt_2_field = getElementByXpath('//*[@id="edit-form-section"]//input[@id="back-alt-2-field"]');
    back_alt_2_field.value = cards[index]['back_alt_2'];
    let deck_field = getElementByXpath('//*[@id="edit-form-section"]//select[@id="deck-field"]');
    deck_field.value = cards[index]['deck'];

    // Get form:
    let form = document.getElementById('basic-card-form');

    form.onsubmit = async (event) => {
        event.preventDefault();     
        let csrftoken = getCookie('csrftoken');
        
        let id_field = document.getElementById('id-field')
        id_field.value = cards[index]['id'];
        id_field.name = 'id';

        try {
            let response = await fetch(`http://127.0.0.1:8000/update/card`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                body: new FormData(form)
            })
            if (response.ok) {
                displayInitialOptions();
                
                let response = await fetchBatch(deck['id']);
                deck = response['deck'];
                cards = response['cards'];
                pagination = response['pagination'];
                
                listBatch();
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function deleteCard(index) {
    let csrftoken = getCookie('csrftoken');
    
    let newDeck = async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/delete/card`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: cards[index]['id']})
            })
            if (response.ok) {
                displayInitialOptions();
                
                let response = await fetchBatch(deck['id']);
                deck = response['deck'];
                cards = response['cards'];
                pagination = response['pagination'];

                if (cards.length != 0) {
                    listBatch();
                } else {
                    let message = document.getElementById('message');
                    message.innerHTML = 'This deck is empty.'
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    newDeck();        
}

async function createCard(form) {
    let csrftoken = getCookie('csrftoken');
    try {
        let response = await fetch(`http://127.0.0.1:8000/create/basic%20card`, {
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