const signInContainer = document.querySelector('.sign-in-container');
const newAccountForm = document.querySelector('.new-account-form');


const buttonEmail = document.querySelector('.button-email');
buttonEmail.style.color = 'var(--color-primary)';
buttonEmail.style.backgroundColor = 'var(--color-accent-dark)';
buttonEmail.addEventListener('click', () => {
    slideTransition('5%', '105%');
    onPressedButton(1);
});

const buttonNewAccount = document.querySelector('.button-new-account');
buttonNewAccount.addEventListener('click', () => {
    slideTransition('-95%', '5%');
    onPressedButton(2);
});

const inputElements = document.querySelectorAll('input')
inputElements.forEach(input => {
    input.addEventListener('focusin', () => {
        input.style.backgroundColor = 'var(--color-accent)';
    });

    input.addEventListener('focusout', () => {
        input.style.backgroundColor = 'white';
    });
});

/**
 * Slider transition for the 'sing-in-container' and 'new-account-form' divs
 * @param {string} position_div1 Position of the 'sign-in-container' div 
 * @param {string} position_div2 Position of the 'new-account-form' div
 */
function slideTransition(position_div1, position_div2) {
    signInContainer.style.left = position_div1;
    newAccountForm.style.left = position_div2;
    
    signInContainer.style.transition = '0.7s';
    newAccountForm.style.transition = '0.7s';
}

/**
 * Changes the appearance of the clicked button
 * @param {number} int_button_pressed 1 -> Sign in button, 2 -> Create new account button
 */
function onPressedButton(int_button_pressed) {
    buttonEmail.style.color = '';
    buttonEmail.style.backgroundColor = '';
    buttonNewAccount.style.color = '';
    buttonNewAccount.style.backgroundColor = '';

    if (int_button_pressed == 1) {
        buttonEmail.style.color = 'var(--color-primary)';
        buttonEmail.style.backgroundColor = 'var(--color-accent-dark)';
    } else {
        buttonNewAccount.style.color = 'var(--color-primary)';
        buttonNewAccount.style.backgroundColor = 'var(--color-accent-dark)';
    }
}