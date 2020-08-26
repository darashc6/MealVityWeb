const burger = document.querySelector('.burger')
const navLinks = document.querySelector('.navigation-links')

burger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile')
})