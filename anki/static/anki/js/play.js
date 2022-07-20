document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        displayInitialPlay();

        // Get deck id:
        const deck_id = element.dataset.id;

        // Fetch deck
        const play_option_form = document.getElementById('play-option-form');

        play_option_form.onsubmit = async (event) => {
            event.preventDefault();
            
            let validate = validateForm();
            
            if (validate === true) {
                const quantity = document.getElementById('quantity').value;
                const minutes = document.getElementById('minutes').value;
                
                try {
                    const response = await fetchDeck(deck_id, quantity);
                    const cards = response['cards'];          
                    
                    if (cards.length === 0) {
                        document.getElementById('game-message').innerHTML = 'This deck is empty.'; 
                    } else {                       
                        showCard(cards, 0, cards.length);

                        if (minutes != '') {
                            // Set timer:
                            var time = minutes * 60;
                            let interval = setInterval(function(){
                                time--;

                                if (time === 0) {
                                    // Clear out card section and btn section:  
                                    const game_card = document.getElementById('game-card');
                                    game_card.innerHTML = '';
                                    const game_btn_div = document.getElementById('game-btn-div');
                                    game_btn_div.innerHTML = '';
                                    
                                    const game_card_div = document.getElementById('game-card-div');
                                    game_card_div.style.visibility = 'hidden';
                                    game_btn_div.style.visibility = 'hidden';

                                    clearInterval(interval);

                                    let game_message = document.getElementById('game-message');
                                    game_message.innerHTML = 'Time is up!';
                                } else {
                                    // const game_section = document.getElementById('game-section');
                                    
                                    // Stop timer when session is finished:
                                    if (game_card.classList.contains('finished')) {
                                        clearInterval(interval);
                                    }

                                    // Stop timer when quit button is clicked:
                                    const game_quit_btn = document.getElementById('game-quit-btn');
                                    game_quit_btn.addEventListener('click', () => {
                                        clearInterval(interval);
                                    })
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

    document.getElementById('game-card').classList.remove('finished');

    document.getElementById('game-card').innerHTML = '';

    document.getElementById('game-message').innerHTML = '';

    document.getElementById('countdown').innerHTML = '';
    
    document.getElementById('game-btn-div').innerHTML = '';
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
    const game_card_div = document.getElementById('game-card-div');
    // game_card_div.style.visibility = 'visible';

    // Get card and mark it as front:
    const game_card = document.getElementById('game-card');
    game_card.classList.add('front-side');
    game_card.classList.remove('back-side');

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
    game_card_div.append(game_card);
    game_card.append(grammar_class);
    game_card.append(front);
    game_card.append(front_extra);

    let game_message = document.getElementById('game-message');
    game_message.innerHTML = 'Click on card to flip it'

    // Add event listener to turn card when clicked:
    game_card.addEventListener('click', () => {
        showCardBack(cards, index, quantity);
        addGradeBtn(cards, index, quantity);
    }, {once: true});
}

function showCardBack(cards, index, quantity) {
    const game_card_div = document.getElementById('game-card-div');

    // Clean card content and mark it as back:
    const game_card = document.getElementById('game-card');
    game_card.innerHTML = '';
    game_card.classList.add('back-side');
    game_card.classList.remove('front-side');

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
    game_card_div.append(game_card);
    game_card.append(back_main);
    game_card.append(back_alt_1);
    game_card.append(back_alt_2);

    let game_message = document.getElementById('game-message');
    game_message.innerHTML = 'Grade card to continue'
}

function addGradeBtn(cards, index, quantity) {
    const cake_btn = document.createElement('button');
    cake_btn.id = 'cake-btn';
    cake_btn.dataset.value = 'PIECE OF CAKE';
    cake_btn.setAttribute('type', 'button');
    cake_btn.innerHTML = 'Piece of cake!';
    cake_btn.classList.add('grade-btn', 'cake-btn');

    const normal_btn = document.createElement('button');
    normal_btn.id = 'normal-btn';
    normal_btn.dataset.value = 'NORMAL';
    normal_btn.setAttribute('type', 'button');
    normal_btn.innerHTML = 'Normal';
    normal_btn.classList.add('grade-btn', 'normal-btn');

    const challenging_btn = document.createElement('button');
    challenging_btn.id = 'challenging-btn';
    challenging_btn.dataset.value = 'CHALLENGING';
    challenging_btn.setAttribute('type', 'button');
    challenging_btn.innerHTML = 'Challenging';
    challenging_btn.classList.add('grade-btn', 'challenging-btn');

    const game_btn_div = document.getElementById('game-btn-div');
    // game_btn_div.style.visibility = 'visible';
    game_btn_div.append(cake_btn);
    game_btn_div.append(normal_btn);
    game_btn_div.append(challenging_btn);

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
                    const game_card = document.getElementById('game-card');
                    game_card.innerHTML = '';
                    const game_btn_div = document.getElementById('game-btn-div');
                    game_btn_div.innerHTML = '';

                    showCard(cards, (index + 1), quantity);
                } else { 
                    const game_card = document.getElementById('game-card');
                    game_card.innerHTML = '';
                    const game_btn_div = document.getElementById('game-btn-div');
                    game_btn_div.innerHTML = '';
                    
                    let game_message = document.getElementById('game-message');
                    game_message.innerHTML = 'Congratulations! You finished this session!'

                    game_card.classList.add('finished');
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

    let game_message = document.getElementById('game-message');

    if (quantity === '') {
        game_message.innerHTML = 'Something went wrong...<br>Quantity must be filled out.';
        return false;
    }
    
    if ((minutes === '' && skip_timer === false) | (minutes != '' && skip_timer === true)) {
        game_message.innerHTML = 'Something went wrong...<br>Either minutes quantity is filled out, or skip timer is checked.';
        return false;
    }

    return true;
}