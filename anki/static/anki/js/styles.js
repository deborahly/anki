// Layout - Header menu
const header_icon = document.getElementById('header-icon');
const header_menu = document.getElementById('header-menu');

header_icon.addEventListener('click', () => {
    // When menu is open and user clicks to close it:
    if (header_icon.classList.contains('open')) {
        header_icon.classList.remove('open');

        header_menu.classList.add('fade-out');
        header_menu.classList.remove('fade-in');
    } else {
        // When menu is closed and user clicks to open it:
        header_icon.classList.add('open');

        header_menu.classList.add('fade-in');
        header_menu.classList.remove('fade-out');
    }
})

// Play - Option section
const overlay_background = document.getElementById('overlay-background');
const game_section = document.getElementById('game-section');
const cancel_option_btn = document.getElementById('cancel-option-btn');
const option_form = document.getElementById('option-form');

document.querySelectorAll('.deck').forEach(element => {
    element.addEventListener('click', () => {                              
        overlay_background.classList.add('fade-in');
        overlay_background.classList.remove('fade-out');

        game_section.classList.add('fade-out');
        game_section.classList.remove('fade-in');

        // Scroll on
        document.querySelector('body').classList.remove("no-scroll");
    })
})

cancel_option_btn.addEventListener('click', () => {
    overlay_background.classList.add('fade-out');
    overlay_background.classList.remove('fade-in');

    // Scroll on
    document.querySelector('body').classList.add("no-scroll");
})

option_form.addEventListener('submit', () => {
    overlay_background.classList.add('fade-out');
    overlay_background.classList.remove('fade-in');

    game_section.classList.add('fade-in');
    game_section.classList.remove('fade-out');

    // Scroll on
    document.querySelector('body').classList.add("no-scroll");
})

