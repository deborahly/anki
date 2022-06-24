document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {
        displayInitialCollection();
        
        const deck_id = element.dataset.id;
        
        const fetchDeck = async (deck_id) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/retrieve/?type=basic&id=${deck_id}`);
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

function displayInitialCollection() {
    const list_section = document.getElementById('list-section');
    list_section.innerHTML = '';

    const edit_section = document.getElementById('edit-section');
    edit_section.style.display = 'none';

    const archive_section = document.getElementById('archive-section');
    archive_section.style.display = 'none';
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
            if (response.ok) {
                // Hide form section:
                const edit_section = document.getElementById('edit-section');
                edit_section.style.display = 'none';
            }

        } catch (error) {
            console.error(error);
        }
    }
}