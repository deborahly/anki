document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        displayInitialPlay();

        // Get deck id:
        const deck_id = element.dataset.id;

        // Show option section:
        document.getElementById('option-section').style.display = 'block';

        // Clear out if cancel btn is clicked:
        let cancel_option_btn = document.getElementById('cancel-option-btn');
        cancel_option_btn.addEventListener('click', () => {
            displayInitialPlay();
        })

        // Fetch deck
        const option_form = document.getElementById('option-form');

        option_form.onsubmit = async (event) => {
            event.preventDefault();
            document.getElementById('option-section').style.display = 'none';
            let validate = validateForm();
            
            if (validate === true) {
                const quantity = document.getElementById('quantity').value;
                const minutes = document.getElementById('minutes').value;
                
                try {
                    const response = await fetchDeck(deck_id, quantity);
                    const cards = response['cards'];          
                    
                    if (cards.length === 0) {
                        message.innerHTML = 'This deck is empty.'; 
                    } else {
                        showCard(cards, 0, cards.length);

                        if (minutes != '') {
                            // Set timer:
                            var time = minutes * 60;
                            let interval = setInterval(function(){
                                time--;

                                if (time === 0) {
                                    // Clear out card section and btn section:  
                                    const card_div = document.getElementById('card-div');
                                    card_div.innerHTML = '';
                                    const btn_div = document.getElementById('btn-div');
                                    btn_div.innerHTML = '';
                                    clearInterval(interval);

                                    let game_message = document.getElementById('game-message');
                                    game_message.innerHTML = 'Time is up!'
                                } else {
                                    const game_section = document.getElementById('game-section');
                                    
                                    if (game_section.classList.contains('finished')) {
                                        clearInterval(interval);
                                    }
                                }

                                const minutes = Math.floor(time / 60);
                                let seconds = time % 60;           
                                seconds = seconds < 10 ? '0' + seconds : seconds;

                                const countdown = document.getElementById('countdown');
                                countdown.innerHTML = `${minutes}:${seconds}`;
                            }, 1000);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    })
});

function displayInitialPlay() {
    document.getElementById('message').innerHTML = '';

    document.getElementById('option-section').style.display = 'none';

    document.getElementById('game-message').innerHTML = '';

    document.getElementById('countdown').innerHTML = '';
    
    document.getElementById('card-div').innerHTML = '';
    
    document.getElementById('btn-div').innerHTML = '';

    document.getElementById('game-section').classList.remove('finished');
}

async function fetchDeck(deck_id, quantity) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/retrieve/session?id=${deck_id}&quantity=${quantity}`);
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
    const card_div = document.getElementById('card-div');

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
    card_div.append(card_front);
    card_front.append(grammar_class);
    card_front.append(front);
    card_front.append(front_extra);

    // Add event listener to turn card when clicked:
    card_front.addEventListener('click', () => {
        showCardBack(cards, index, quantity);
        addGradeBtn(cards, index, quantity);
    }, {once: true});
}

function showCardBack(cards, index, quantity) {
    // Clean card section
    const card_div = document.getElementById('card-div');
    card_div.innerHTML = '';
        
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
    card_div.append(card_back);
    card_back.append(back_main);
    card_back.append(back_alt_1);
    card_back.append(back_alt_2);

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        showCard(cards, index, quantity);
    }, {once: true});
}

function addGradeBtn(cards, index, quantity) {
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

    const btn_div = document.getElementById('btn-div');
    btn_div.append(cake_btn);
    btn_div.append(normal_btn);
    btn_div.append(challenging_btn);

    [cake_btn, normal_btn, challenging_btn].forEach(element => {
        element.addEventListener('click', (event) => {
            const grade = event.target.dataset.value;
            updateGrade(grade, cards, index, quantity);
        })
    })
}

function updateGrade(grade, cards, index, quantity) {
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
                if (index < (quantity - 1) && index < (cards.length - 1)) {
                    const card_div = document.getElementById('card-div');
                    card_div.innerHTML = '';
                    const btn_div = document.getElementById('btn-div');
                    btn_div.innerHTML = '';

                    showCard(cards, (index + 1), quantity);
                } else { 
                    const card_div = document.getElementById('card-div');
                    card_div.innerHTML = '';
                    const btn_div = document.getElementById('btn-div');
                    btn_div.innerHTML = '';
                    
                    let game_message = document.getElementById('game-message');
                    game_message.innerHTML = 'Congratulations! You finished this session!'

                    const game_section = document.getElementById('game-section');
                    game_section.classList.add('finished');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchCardGrade();        
}

function validateForm() {
    const quantity = document.getElementById('quantity').value;
    const minutes = document.getElementById('minutes').value;
    const skip_timer = document.getElementById('skip-timer').checked;

    let message = document.getElementById('message');

    if (quantity === '') {
        message.innerHTML = 'Quantity must be filled out.';
        return false;
    }
    
    if ((minutes === '' && skip_timer === false) | (minutes != '' && skip_timer === true)) {
        message.innerHTML = 'Either minutes is filled out, or skip timer is checked.';
        return false;
    }

    return true;
}