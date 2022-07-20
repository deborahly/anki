// HTML elements
const overlay_background = document.querySelector('.overlay-background');
const option_nav = document.getElementById('option-nav');
const deck_info_link = document.getElementById('deck-info-link');
const list_deck_link = document.getElementById('list-deck-link');
const create_card_link = document.getElementById('create-card-link');
const create_form_div = document.getElementById('create-form-div');
const option_display = document.getElementById('option-display');
const nav_go_back_btn = document.getElementById('nav-go-back-btn');
const display_go_back_btn = document.getElementById('display-go-back-btn');
const edit_go_back_btn = document.getElementById('edit-go-back-btn');
const create_go_back_btn = document.getElementById('create-go-back-btn');

document.querySelectorAll('.manage-link').forEach(element => {
    element.addEventListener('click', () => {   
        overlay_background.classList.add('fade-in');
        overlay_background.classList.remove('fade-out');

        option_nav.classList.add('fade-in');
        option_nav.classList.remove('fade-out');

        // Desktop only
        option_nav.classList.add('fade-in-once');
    });
});

[deck_info_link, list_deck_link].forEach(element => {
    element.addEventListener('click', () => {
        option_display.classList.add('fade-in');
        option_display.classList.remove('fade-out');

        option_nav.classList.add('fade-out');
        option_nav.classList.remove('fade-in');

        // Desktop only
        option_display.classList.add('appear');
        option_display.classList.remove('disappear');

        create_form_div.classList.add('disappear');
        create_form_div.classList.remove('appear');
    });
});

create_card_link.addEventListener('click', () => {
    create_form_div.classList.add('fade-in');
    create_form_div.classList.remove('fade-out');

    option_nav.classList.add('fade-out');
    option_nav.classList.remove('fade-in');

    // Desktop only
    create_form_div.classList.add('appear');
    create_form_div.classList.remove('disappear');

    option_display.classList.add('disappear');
    option_display.classList.remove('appear');
});

nav_go_back_btn.addEventListener('click', () => {
    overlay_background.classList.add('fade-out');
    overlay_background.classList.remove('fade-in');

    option_nav.classList.add('fade-out');
    option_nav.classList.remove('fade-in');
});

display_go_back_btn.addEventListener('click', () => {
    option_nav.classList.add('fade-in');
    option_nav.classList.remove('fade-out');
    
    option_display.classList.add('fade-out');
    option_display.classList.remove('fade-in');
});

create_go_back_btn.addEventListener('click', () => {
    option_nav.classList.add('fade-in');
    option_nav.classList.remove('fade-out');
    
    create_form_div.classList.add('fade-out');
    create_form_div.classList.add('fade-in');
});
        






