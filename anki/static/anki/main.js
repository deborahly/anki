document.addEventListener('DOMContentLoaded', function() {
    // When Index page is loaded:
    if (document.title === 'Collection') {
        // Show deck when selected:
        document.querySelectorAll('.deck').forEach(deck => {
            deck.addEventListener('click', event => {                
                // Update page display:
                document.getElementById('deck-section').style.display = 'none';
                document.getElementById('card-section').style.display = 'block';
                
                const name = deck.innerHTML;
                
                const fetchDeck = async (name) => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/retrieve/?type=basic&name=${name}`);
                        const data = await response.json();
                        current_deck = await data.cards;
                    } catch (error) {
                        console.error(error);
                    } 
                    return showDeck(current_deck, 0);
                }
                fetchDeck(name);
            })
        }); 
    }
})

function showDeck(deck, index) {    
    showCard(deck[index]);
    
    // Clear out button section:  
    const btn_section = document.getElementById('btn-section');
    btn_section.innerHTML = '';

    // If card 1 of cards:
    if (index === 0 && deck.length > 1) {
            addNextBtn();
            
            const next_btn = document.getElementById('next-btn');
            next_btn.addEventListener('click', () => {
                index++;
                showDeck(deck, index);
            }, {once: true});
    } else {
        // If last card of cards:
        if (index !== 0 && index === deck.length - 1) {
            addPreviousBtn();
            
            const previous_btn = document.getElementById('previous-btn');
            previous_btn.addEventListener('click', () => {
                index--;
                showDeck(deck, index);
            }, {once: true});     
        } else {
            // Card x of cards:
            if (index !== 0 && index !== deck.length - 1) {
                addPreviousBtn();
                addNextBtn();

                const previous_btn = document.getElementById('previous-btn');
                previous_btn.addEventListener('click', () => {
                    index--;
                    showDeck(deck, index);
                }, {once: true});

                const next_btn = document.getElementById('next-btn');
                next_btn.addEventListener('click', () => {
                    index++;
                    showDeck(deck, index);
                }, {once: true});
            }
        }
    }
}

// function fetchDeck(name) {
//     fetch(`http://127.0.0.1:8000/retrieve/?type=basic&name=${name}`)
//     .then(response => response.json())
//     .then(data => {
        // const deck = data.cards;
        // var card_index = 0;

        // // If card 1 of 1:
        // if (card_index === 0 && deck.length === 1) {
        //     showCard(deck[card_index]);
        // } else {
        //     // If card 1 of many:
        //     showCard(deck[card_index]);
        //     addNextBtn();
        //     const next_btn = document.getElementById('next-btn');   
        //     next_btn.addEventListener('click', () => {
        //         card_index++;
        //         showCard(deck[card_index]);
        //     }), {once: true};
        // }
            // } else {
            //     // Last card of cards:
            //     if (card_index === deck.lenght - 1) {
            //         addPreviousBtn();
            //         const previous_btn = document.getElementById('previous-btn');
            //         previous_btn.addEventListener('click', () => {
            //             card_index--;
            //             showCard(deck[card_index]);
            //         });              
            //     } else {
            //         // Card x of cards:
            //         addNextBtn();
            //         addPreviousBtn();
            //         const next_btn = document.getElementById('next-btn');
            //         next_btn.addEventListener('click', () => {
            //             card_index++;
            //             showCard(deck[card_index]);
            //         });
            //         const previous_btn = document.getElementById('previous-btn');
            //         previous_btn.addEventListener('click', () => {
            //             card_index--;
            //             showCard(deck[card_index]);
            //         });
            //     }
            // }
//     })
//     .catch((error) => {
//         console.error(`Error: ${error}`);
//     });
// }


function showCard(card) {
    // Clean card section
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';

    // Create card front:
    const card_front = document.createElement('div');
    card_front.classList.add('card');
    card_front.dataset.side = 'front';

    // Create elements:
    const grammar_class = document.createElement('div');
    grammar_class.innerHTML = card['grammar_class'];
    grammar_class.classList.add('grammar-class');

    const front = document.createElement('div');
    front.innerHTML = card['front'];
    front.classList.add('front');

    const front_extra = document.createElement('div');
    front_extra.innerHTML = card['front_extra'];
    front_extra.classList.add('front-extra');

    // Append everything:
    card_section.append(card_front);
    card_front.append(grammar_class);
    card_front.append(front);
    card_front.append(front_extra);

    // Add event listener to turn card when clicked:
    card_front.addEventListener('click', () => {
        showCardBack(card);
    }, {once: true});
}

function showCardBack(card) {
    // Clean card section
    const card_section = document.getElementById('card-section');
    card_section.innerHTML = '';
        
    // Create card back:
    const card_back = document.createElement('div');
    card_back.classList.add('card');
    card_back.dataset.side = 'back';

    // Create elements:
    const back_main = document.createElement('div');
    back_main.innerHTML = card['back_main'];
    back_main.classList.add('back-main')

    const back_alt_1 = document.createElement('div');
    back_alt_1.innerHTML = card['back_alt_1'];
    back_alt_1.classList.add('back-alt-1')

    const back_alt_2 = document.createElement('div');
    back_alt_2.innerHTML = card['back_alt_2'];
    back_alt_2.classList.add('back-alt-2')

    // Append everything:
    card_section.append(card_back);
    card_back.append(back_main);
    card_back.append(back_alt_1);
    card_back.append(back_alt_2);

    // Add event listener to turn card when clicked:
    card_back.addEventListener('click', () => {
        showCard(card);
    }, {once: true});
}

function addPreviousBtn() {
    const previous_btn = document.createElement('button');
    previous_btn.id = 'previous-btn';
    previous_btn.innerHTML = 'Previous card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(previous_btn);
}

function addNextBtn() {
    const next_btn = document.createElement('button');
    next_btn.id = 'next-btn';
    next_btn.innerHTML = 'Next card';

    const btn_section = document.getElementById('btn-section');
    btn_section.append(next_btn);
}