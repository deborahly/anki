document.addEventListener('DOMContentLoaded', function() {
    // When PLAY CARDS page is loaded:
    if (document.title === 'Play cards') {
        // Show deck when selected:
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
    }

    // When MY COLLECTION page is loaded:
    if (document.title === 'My collection') {
        // List cards on deck when selected:
        document.querySelectorAll('.deck').forEach(element => {
            element.addEventListener('click', () => {
                displayInitialCollection();
                
                const deck_id = element.dataset.id;
                
                const fetchDeck = async (deck_id) => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/retrieve/?id=${deck_id}`);
                        const data = await response.json();
                        deck = await data.deck;
                        cards = await data.cards;
                        listDeck(deck, cards);
                    } catch (error) {
                        console.error(error);
                    } 
                }
                fetchDeck(deck_id);
            })
        }); 
    }

    // When ARCHIVE page is loaded:
    if (document.title === 'Archive') {
        // Unarchive when button is clicked:
        document.querySelectorAll('.unarchive-btn').forEach(element => {
            element.addEventListener('click', () => {                
                const csrftoken = getCookie('csrftoken');
                
                const deck_id = element.dataset.id;
                
                const unarchiveDeck = async (deck_id) => {
                    try {
                        const response = await fetch('http://127.0.0.1:8000/unarchive', {
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({deck_id: deck_id})
                        })
                        if (response.ok) {
                            const list_element = document.getElementById(`li-${deck_id}`);
                            list_element.remove();
                        }
                    } catch (error) {
                        console.error(error);
                    } 
                }
                unarchiveDeck(deck_id);
            })
        }); 
        // Delete when button is clicked:
        document.querySelectorAll('.delete-deck-btn').forEach(element => {
            element.addEventListener('click', () => {                
                var result = confirm('Are you sure to delete?');
                if (result) {
                    const csrftoken = getCookie('csrftoken');
                
                    const deck_id = element.dataset.id;
                    
                    const deleteDeck = async (deck_id) => {
                        try {
                            const response = await fetch('http://127.0.0.1:8000/delete/deck', {
                                method: 'POST',
                                headers: {
                                    'X-CSRFToken': csrftoken,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({deck_id: deck_id})
                            })
                            if (response.ok) {
                                const list_element = document.getElementById(`li-${deck_id}`);
                                list_element.remove();
                            }
                        } catch (error) {
                            console.error(error);
                        } 
                    }
                    deleteDeck(deck_id);
                } 
            })
        }); 
    }
})

function displayInitialPlay() {
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';
    
    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';
    
    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'none';
}

function displayInitialCollection() {
    const list_section = document.getElementById('list-section');
    list_section.innerHTML = '';

    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'none';

    const archive_section = document.getElementById('archive-section');
    archive_section.style.display = 'none';
}

function playDeck(cards, index) {    
    if (cards.length === 0) {
        alert('This deck is empty.');
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

function listDeck(deck, cards) { 
    if (cards.length === 0) {
        updateArchiveForm(deck['id']);
    } else {
        const list_section = document.getElementById('list-section');

        const list_header = document.createElement('div');
        list_header.id = 'list-header';
        list_section.append(list_header);
    
        const list_name = document.createElement('h5');
        list_name.innerHTML = deck['name'];
        list_header.append(list_name);
    
        const list = document.createElement('ol');
        list_section.append(list);
        
        for (let i = 0; i < cards.length; i++) {
            let list_element = document.createElement('li');
    
            let list_link = document.createElement('a');
            list_link.setAttribute('href', '#');
            list_link.innerHTML = `${cards[i]['front']}`
    
            list_element.append(list_link);
            list.append(list_element);
    
            list_element.addEventListener('click', (event) => {
                event.preventDefault();
                editCard(cards, i);
            })
        }
        updateArchiveForm(deck['id']);
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
        addGradeBtn(cards, index);
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

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        showCard(cards, index);
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

function addGradeBtn(cards, index) {
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

    // const cake_btn = document.getElementById('cake-btn');
    // const normal_btn = document.getElementById('normal-btn');
    // const challenging_btn = document.getElementById('challenging-btn');
    [cake_btn, normal_btn, challenging_btn].forEach(element => {
        element.addEventListener('click', (event) => {
            const grade = event.target.dataset.value;
            updateGrade(grade, cards, index);
        })
    })
}

function updateArchiveForm(deck_id) {
    // Display form section:
    const archive_section = document.getElementById('archive-section');
    archive_section.style.display = 'block';
    // Inform deck to be archived:
    const deck_to_archive = document.getElementById('deck-to-archive');
    deck_to_archive.value = deck_id;
}

function editCard(cards, index) {
    // Display form section:
    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'block';

    // Pre-fill form with current data:
    document.getElementById('grammar-class-field').value = cards[index]['grammar_class'];
    document.getElementById('grade-field').value = cards[index]['grade'];
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
                    // Clear out card section:  
                    const card_section = document.getElementById('card-section');
                    card_section.innerHTML = '';
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    newDeck();        
}

function updateGrade(grade, cards, index) {
    const csrftoken = getCookie('csrftoken');
    
    const fetchCardGrade = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/grade/card', {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: cards[index]['id'], grade: grade})
            })
            if (response.ok) {
                if (index < (cards.length - 1)) {
                    showcards(cards, (index + 1));
                } else {
                    // Clear out card section and btn section:  
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
    fetchCardGrade();        
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

function loadScript(url)
{    
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}