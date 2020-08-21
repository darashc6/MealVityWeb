const burger = document.getElementsByClassName('burger')[0]
const navigationLinks = document.getElementsByClassName('navigation-links')[0]

burger.addEventListener('click', () => {
    navigationLinks.classList.toggle('mobile')
})
