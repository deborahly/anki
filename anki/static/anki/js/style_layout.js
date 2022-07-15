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