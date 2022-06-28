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
    } else {
        // Clear out button section:  
        const btn_section = document.getElementById('btn-section');
        btn_section.innerHTML = '';
        showCard(cards, index);
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

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        playDeck(cards, index);
    }, {once: true});
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