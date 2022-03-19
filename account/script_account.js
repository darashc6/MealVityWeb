users = [];

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
    slideTransition('-95%', '10%');
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

$(document).ready(function () {
    /** Load users from DB (In this case, LocalStorage) **/
    loadUsers();

    /** New account form **/
    $("#new-account-form").submit(function (e) {
        e.preventDefault();

        let fullName = $("#full-name").val();
        let phoneNumber = $("#phone-number").val();
        let email = $("#email").val();
        let password = $("#password").val();
        let repeatPassword = $("#repeat-password").val();

        if (password === repeatPassword) {
            let userAlreadyExists = checkUser(email);

            if (userAlreadyExists) {
                alert("User already exists, please insert a new email")
            } else {
                newUser = {
                    "fullName": fullName,
                    "phoneNumber": phoneNumber,
                    "email": email,
                    "password": password,
                    "repeatPassword": repeatPassword
                }

                saveUserToDb(newUser);
                alert("New account created!");

                $("#full-name").val("");
                $("#phone-number").val("");
                $("#email").val("");
                $("#password").val("");
                $("#repeat-password").val("");
            }
        } else {
            alert("Passwords do not match");
        }
    });

    /** Sign in form **/
    $("#sign-in-form").submit(function (e) {
        e.preventDefault();

        let email = $("#login-email").val();
        let password = $("#login-password").val();

        const userLoggedIn = loginUser(email, password);

        if (userLoggedIn) {
            alert("User successfully logged in!");

            $("#login-email").val("");
            $("#login-password").val("");
        } else {
            alert("User credentials do not match. Please try again.")
        }
    });
});

function loadUsers() {
    const usersJsonString = localStorage.getItem("users") || "[]";
    users = JSON.parse(usersJsonString)
}

function checkUser(email) {
    const userFound = users.find(user => user.email === email)
    return userFound || false;
}

function saveUserToDb(newUser) {
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
}

function loginUser(email, password) {
    const userLoggedIn = users.find(user => user.email === email && user.password === password);

    return userLoggedIn || null;
}