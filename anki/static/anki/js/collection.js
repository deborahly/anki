// Constants
const PER_PAGE = 8;

// Globals
var deck_id;
var deck = {};
var cards = [];
var pagination = [];
var page_index = 0;

document.querySelectorAll('.manage-link').forEach(element => {
    element.addEventListener('click', () => {      
        displayInitialSet();
        
        deck_id = element.dataset.id;

        document.getElementById('manage-title').innerHTML = element.dataset.name;

        // If deck info is selected:   
        document.getElementById('deck-info-link').addEventListener('click', () => {
            let getInfo = async () => {
                await fetchBatch(deck_id, page_index);
                
                displayInitialSet();
                
                showInfo();
            }
            getInfo();
        })
    
        // If list deck is selected:
        document.getElementById('list-deck-link').addEventListener('click', () => {
            let getBatch = async () => {
                page_index = 1;
                
                await fetchBatch(deck_id, page_index);
                
                displayInitialSet();

                if (cards.length != 0) {
                    listBatch();
                } else {
                    document.getElementById('option-area').innerHTML = 'This deck is empty.';
                }
            }
            getBatch();
        })
    
        // If create card is selected:
        document.getElementById('create-card-link').addEventListener('click', () => {
            displayInitialSet();
            
            let deck_field = getElementByXpath('//*[@id="create-form-div"]//select[@id="deck-field"]');
            deck_field.value = deck_id;
    
            let form = getElementByXpath('//*[@id="create-form-div"]//form[@id="create-basic-card-form"]');
            form.onsubmit = async (event) => {
                event.preventDefault();
                createCard(form);
            }
        })
    })
});

function displayInitialSet() {
    document.getElementById('message').innerHTML = '';

    document.getElementById('option-area').innerHTML = '';
    
    document.getElementById('next-previous-btn-div').innerHTML = '';

    document.getElementById('create-message').innerHTML = '';

    // Desktop only
    document.getElementById('edit-form-div').classList.add('disappear');
    document.getElementById('edit-form-div').classList.remove('appear');
}

async function fetchBatch(deck_id, page_index) {
    try {
        let response = await fetch(`http://127.0.0.1:8000/retrieve/batch?id=${deck_id}&page=${page_index}&per-page=${PER_PAGE}`);
        let data = await response.json();
        pagination = await data.pagination;
        deck = await data.deck;
        cards = await data.cards;
    } catch (error) {
        console.error(error);
    } 
}

function showInfo() {
    let option_area = document.getElementById('option-area');

    // let deck_name = document.createElement('div');
    // deck_name.innerHTML = `Deck name: ${deck['name']}`;
    
    let total_cards = document.createElement('div');
    total_cards.innerHTML = `Total cards: ${deck['count']}`;

    let grade = document.createElement('div');
    grade.innerHTML = `Grade: ${deck['grade']}`;

    let created_at = document.createElement('div');
    created_at.innerHTML = `Created at: ${deck['created_at']}`;

    let updated_at = document.createElement('div');
    updated_at.innerHTML = `Last played at: ${deck['updated_at']}`;

    // option_area.append(deck_name);
    option_area.append(total_cards);
    option_area.append(grade);
    option_area.append(created_at);
    option_area.append(updated_at);
}

function listBatch() {
    let option_area = document.getElementById('option-area');

    let table = document.createElement('table');
    option_area.append(table);
    
    for (let i = 0; i < cards.length; i++) {
        let tr = document.createElement('tr');
        let td_card = document.createElement('td');
        let td_edit = document.createElement('td');
        let td_delete = document.createElement('td');

        td_card.innerHTML = `${cards[i]['front']}`;

        let edit_link = document.createElement('a');
        edit_link.setAttribute('href', '#');
        edit_link.classList.add('edit-link');
        edit_link.innerHTML = 'Edit';
        td_edit.append(edit_link);  

        let delete_link = document.createElement('a');
        delete_link.setAttribute('href', '#');
        delete_link.classList.add('delete-link');
        delete_link.innerHTML = 'Delete';
        td_delete.append(delete_link);

        table.append(tr);
        tr.append(td_card);
        tr.append(td_edit);
        tr.append(td_delete);
        
        edit_link.addEventListener('click', () => {
            editCard(i);
            document.getElementById('edit-form-div').classList.add('fade-in');
            document.getElementById('edit-form-div').classList.remove('fade-out');
            document.getElementById('option-display').classList.add('fade-out');
            document.getElementById('option-display').classList.remove('fade-in');

            // Desktop only
            document.getElementById('edit-form-div').classList.add('appear');
            document.getElementById('edit-form-div').classList.remove('disappear');
            document.getElementById('option-display').classList.add('appear');
            document.getElementById('option-display').classList.remove('disappear');
        })

        delete_link.addEventListener('click', () => {
            var result = confirm('Are you sure to delete?');
            if (result) {
                deleteCard(i);
            }
        })
    }

    addPaginationBtn();
}

function editCard(index) {
    // Add listener to cancel input:
    let edit_go_back_btn = document.getElementById('edit-go-back-btn');
    edit_go_back_btn.addEventListener('click', () => {
        document.getElementById('edit-form-div').classList.add('fade-out');
        document.getElementById('edit-form-div').classList.remove('fade-in');
        document.getElementById('option-display').classList.add('fade-in');
        document.getElementById('option-display').classList.remove('fade-out');
    })

    // Pre-fill form with current data:
    let grammar_class_field = getElementByXpath('//*[@id="edit-form-div"]//select[@id="grammar-class-field"]');
    grammar_class_field.value = cards[index]['grammar_class'];
    let grade_field = getElementByXpath('//*[@id="edit-form-div"]//select[@id="grade-field"]');
    grade_field.value = cards[index]['grade'];
    let front_field = getElementByXpath('//*[@id="edit-form-div"]//input[@id="front-field"]');
    front_field.value = cards[index]['front'];
    let front_extra_field = getElementByXpath('//*[@id="edit-form-div"]//input[@id="front-extra-field"]');
    front_extra_field.value = cards[index]['front_extra'];
    let back_main_field = getElementByXpath('//*[@id="edit-form-div"]//input[@id="back-main-field"]');
    back_main_field.value = cards[index]['back_main'];
    let back_alt_1_field = getElementByXpath('//*[@id="edit-form-div"]//input[@id="back-alt-1-field"]');
    back_alt_1_field.value = cards[index]['back_alt_1'];
    let back_alt_2_field = getElementByXpath('//*[@id="edit-form-div"]//input[@id="back-alt-2-field"]');
    back_alt_2_field.value = cards[index]['back_alt_2'];
    let deck_field = getElementByXpath('//*[@id="edit-form-div"]//select[@id="deck-field"]');
    deck_field.value = cards[index]['deck'];

    // Get form:
    let form = document.getElementById('edit-basic-card-form');

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
                await fetchBatch(deck['id'], page_index);
                
                displayInitialSet();
                
                document.getElementById('edit-form-div').classList.add('fade-out');
                document.getElementById('edit-form-div').classList.remove('fade-in');
                document.getElementById('option-display').classList.add('fade-in');
                document.getElementById('option-display').classList.remove('fade-out');

                // Desktop only
                document.getElementById('edit-form-div').classList.add('disappear');
                document.getElementById('edit-form-div').classList.remove('appear');
                
                listBatch();
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function deleteCard(index) {
    let csrftoken = getCookie('csrftoken');
    
    let deleteFromDeck = async () => {
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
                await fetchBatch(deck['id'], page_index);

                displayInitialSet();

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

    deleteFromDeck();        
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
        let grammar_class_field = getElementByXpath('//*[@id="create-form-div"]//select[@id="grammar-class-field"]');
        grammar_class_field.value = '';
        let grade_field = getElementByXpath('//*[@id="create-form-div"]//select[@id="grade-field"]');
        grade_field.value = '';
        let front_field = getElementByXpath('//*[@id="create-form-div"]//input[@id="front-field"]');
        front_field.value = '';
        let front_extra_field = getElementByXpath('//*[@id="create-form-div"]//input[@id="front-extra-field"]');
        front_extra_field.value = '';
        let back_main_field = getElementByXpath('//*[@id="create-form-div"]//input[@id="back-main-field"]');
        back_main_field.value = '';
        let back_alt_1_field = getElementByXpath('//*[@id="create-form-div"]//input[@id="back-alt-1-field"]');
        back_alt_1_field.value = '';
        let back_alt_2_field = getElementByXpath('//*[@id="create-form-div"]//input[@id="back-alt-2-field"]');
        back_alt_2_field.value = '';
        
        if (response.ok) {
            // Show message:
            let create_message = document.getElementById('create-message');
            create_message.innerHTML = 'Card successfully created.';
            
            setTimeout(function() {
                create_message.innerHTML = '';
            }, 3000);
        } else {
            // Show message:
            let create_message = document.getElementById('create-message');
            create_message.innerHTML = 'It was not possible to create the card. Please, try again.';

            setTimeout(function() {
                create_message.innerHTML = '';
            }, 3000);
        }
    } catch (error) {
        console.error(error);
        }
}

function addPaginationBtn() {
    let next_previous_btn_div = document.getElementById('next-previous-btn-div');
    
    if (pagination.has_previous === false && pagination.has_next === true) {
        let next_btn = document.createElement('button');
        next_btn.setAttribute('type', 'button');
        next_btn.innerHTML = 'Next';
        next_previous_btn_div.append(next_btn);

        // Add event listener to next button:
        next_btn.addEventListener('click', (event) => {
            event.preventDefault();
            page_index++;
            let getBatch = async () => {
                await fetchBatch(deck['id'], page_index);
                
                displayInitialSet();
                
                listBatch();
            }
            getBatch();
        })
    } else {
        if (pagination.has_previous === true && pagination.has_next === false) {
            let previous_btn = document.createElement('button');
            previous_btn.setAttribute('type', 'button');
            previous_btn.innerHTML = 'Previous';
            next_previous_btn_div.append(previous_btn);

            // Add event listener to previous button:
            previous_btn.addEventListener('click', (event) => {
                event.preventDefault();
                page_index--;
                let getBatch = async () => {
                    await fetchBatch(deck['id'], page_index);
                    
                    displayInitialSet();
                    
                    listBatch();
                }
                getBatch();
            })
        } else {
            if (pagination.has_previous === true && pagination.has_next === true) {
                let previous_btn = document.createElement('button');
                previous_btn.setAttribute('type', 'button');
                previous_btn.innerHTML = 'Previous';
                next_previous_btn_div.append(previous_btn);

                // Add event listener to previous button:
                previous_btn.addEventListener('click', (event) => {
                    event.preventDefault();
                    page_index--;
                    let getBatch = async () => {
                        await fetchBatch(deck['id'], page_index);
                        
                        displayInitialSet();
                        
                        listBatch();
                    }
                    getBatch();
                })
                
                let next_btn = document.createElement('button');
                next_btn.setAttribute('type', 'button');
                next_btn.innerHTML = 'Next';
                next_previous_btn_div.append(next_btn);

                // Add event listener to next button:
                next_btn.addEventListener('click', (event) => {
                    event.preventDefault();
                    page_index++;
                    let getBatch = async () => {
                        await fetchBatch(deck['id'], page_index);
                        
                        displayInitialSet();
                        
                        listBatch();
                    }
                    getBatch();
                })
            }
        }
    }
}