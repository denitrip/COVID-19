const navOpenedClass = 'nav-opened';
const menu = 'nav';
const hamburgerToggleClass = '.hamburger-toggle';

function closeMenu() {
    const nav = document.getElementById('nav');
    const toggleNav = document.getElementById('toggle-nav');
    nav.classList.remove(navOpenedClass);
    toggleNav.checked = false;
}

function createHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    hamburgerMenu.innerHTML =
        `<div class="header-wrapper">
            <h1>COVID-19 Global Cases by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins (JHU)</h1>
            <div class="hamburger-toggle">
              <input id="toggle-nav" type="checkbox"></input>
              <label for="toggle-nav" class="hamburger" id='toggle-nav-label'>
                  <div class="top"></div>
                  <div class="meat"></div>
                  <div class="bottom"></div>
              </label>
            </div>
            <nav id='nav'>
              <ul class='nav-list' id='nav-list'>
                <a href="https://rs.school/js/" target="_blank"><li class='nav-element'>RS School</li></a>
              </ul>
            </nav>
        </div>`;
    document.addEventListener('click', (event) => {
        if (!event.target.closest(hamburgerToggleClass) && !event.target.closest(menu)) {
            closeMenu();
        }
    });

    document.getElementById('toggle-nav-label').addEventListener('click', () => {
        const nav = document.getElementById('nav');
        nav.classList.toggle(navOpenedClass);
    });

    Array.from(document.getElementsByClassName('nav-element')).forEach((element) => {
        element.addEventListener('click', () => {
            closeMenu();
        });
    });
}

createHamburgerMenu();