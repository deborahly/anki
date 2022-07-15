// HTML elements
const overlay_background = document.querySelector('.overlay-background');
const play_option_section = document.getElementById('play-option-section');
const play_cancel_option_btn = document.getElementById('play-cancel-option-btn');
const game_section = document.getElementById('game-section');
const play_option_form = document.getElementById('play-option-form');
const game_card = document.getElementById('game-card');
const game_quit_btn = document.getElementById('game-quit-btn');

// Option section
document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        overlay_background.classList.add('fade-in');
        overlay_background.classList.remove('fade-out');

        play_option_section.classList.add('fade-in');
        play_option_section.classList.remove('fade-out');

        document.querySelector('body').classList.add("no-scroll");
    })
})

play_cancel_option_btn.addEventListener('click', () => {
    overlay_background.classList.add('fade-out');
    overlay_background.classList.remove('fade-in');

    play_option_section.classList.add('fade-out');
    play_option_section.classList.remove('fade-in');

    document.querySelector('body').classList.remove("no-scroll");
})

play_option_form.addEventListener('submit', () => {
    play_option_section.classList.add('fade-out');
    play_option_section.classList.remove('fade-in');

    game_section.classList.add('fade-in');
    game_section.classList.remove('fade-out');

    document.querySelector('body').classList.add("no-scroll");
})

// Game section
game_quit_btn.addEventListener('click', () => {
    overlay_background.classList.add('fade-out');
    overlay_background.classList.remove('fade-in');

    game_section.classList.add('fade-out');
    game_section.classList.remove('fade-in');

    document.querySelector('body').classList.remove("no-scroll");
})

