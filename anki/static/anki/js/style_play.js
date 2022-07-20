// HTML elements
const play_overlay_background = document.querySelector('.play-overlay-background');
const play_option_section = document.getElementById('play-option-section');
const play_cancel_option_btn = document.getElementById('play-cancel-option-btn');
const game_section = document.getElementById('game-section');
const play_option_form = document.getElementById('play-option-form');
const game_card = document.getElementById('game-card');
const game_card_div = document.getElementById('game-card-div');
const game_quit_btn = document.getElementById('game-quit-btn');
const game_btn_div = document.getElementById('game-btn-div');

// Option section
document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        play_overlay_background.classList.add('fade-in');
        play_overlay_background.classList.remove('fade-out');

        play_option_section.classList.add('fade-in');
        play_option_section.classList.remove('fade-out');

        document.querySelector('body').classList.add("no-scroll");
    })
})

play_cancel_option_btn.addEventListener('click', () => {
    play_overlay_background.classList.add('fade-out');
    play_overlay_background.classList.remove('fade-in');

    play_option_section.classList.add('fade-out');
    play_option_section.classList.remove('fade-in');

    document.querySelector('body').classList.remove("no-scroll");
})

play_option_form.addEventListener('submit', () => {
    play_option_section.classList.add('fade-out');
    play_option_section.classList.remove('fade-in');

    game_section.classList.add('fade-in');
    game_section.classList.remove('fade-out');

    game_card_div.style.visibility = 'visible';
    game_btn_div.style.visibility = 'visible';

    document.querySelector('body').classList.add("no-scroll");
})

// Game section
game_quit_btn.addEventListener('click', () => {
    play_overlay_background.classList.add('fade-out');
    play_overlay_background.classList.remove('fade-in');

    game_card.classList.remove('finished', 'front-side', 'back-side');
    game_card.innerHTML = '';
    
    game_btn_div.innerHTML = '';

    game_card_div.style.visibility = 'hidden';
    game_btn_div.style.visibility = 'hidden';

    game_section.classList.add('fade-out');
    game_section.classList.remove('fade-in');

    document.querySelector('body').classList.remove("no-scroll");
})

