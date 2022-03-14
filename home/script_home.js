const autocompleteResultsDiv = document.querySelector('.autocomplete-results');
let addressSelected = false;

$(document).ready(function () {
    /** Set current yeat **/
    $("#current-year").text(new Date().getFullYear());

    /** Check if cookie is set **/
    checkCookie();

    /** Show discount form **/
    showDiscountForm();

    /** Settings Modal **/
    settingsModal();

    /** Cookie button */
    $(".cookie-btn").click(function (e) {
        e.preventDefault();

        // Set cookie for 7 days
        document.cookie = "CookieBy=MealvityWeb; max-age=" + (60 * 60 * 24 * 7);
        $(".cookie-wrapper-container").toggleClass("active");
    });

    $("#settings-modal-btn-reset").click(function (e) {
        e.preventDefault();

        // Remove preferences
        localStorage.removeItem("background-color");
        localStorage.removeItem("font-size");
        localStorage.removeItem("mode");

        // Set default values in form
        $("#input-font-size").val(1);
        $("#input-background-color").val("");
        $("#input-mode").val("normal");

        // Set default values in CSS
        $(":root").css("--color-primary", "var(--normal-mode-color-primary)");
        $(":root").css("--color-accent", "var(--normal-mode-color-accent)");
        $(":root").css("--white", "var(--normal-mode-white)");
        $(":root").css("--black", "var(--normal-mode-black)");
        $(":root").css("--text-primary", "var(--normal-mode-text-primary)");
        $("body").css("background-color", `var(--color-primary)`);

        $(".var-font-type").css("font-size", `var(--font-type-1)`);
        $(".var-font-type-paragraph").css("font-size", `var(--font-type-paragraph-1)`);
    });

    $("#restaurant-search-form").submit(function (e) {
        e.preventDefault();

        let inputAddress = $(".input-address").val();

        if (inputAddress.length !== 0) {
            if (addressSelected) {
                location.href = "search_results/search_results.html"
            } else {
                alert('Please select a valid address')
                $(".input-address").focus();
            }
        } else {
            alert('Please enter a valid address')
            $(".input-address").focus();
        }
    });

    $(".input-address").keyup(function (e) {
        e.preventDefault();

        let inputAddress = $(".input-address").val();

        if (inputAddress.length !== 0) {
            if (addressSelected && inputAddress.value !== sessionStorage.getItem('address')) {
                addressSelected = false;
            }

            fetchAutocomplete(inputAddress).then(() => {
                $(".result").each(function (index, element) {
                    $(element).click(function (e) {
                        e.preventDefault();

                        addressSelected = true;
                        let selectedAddress = $(element).html();
                        sessionStorage.setItem("address", selectedAddress)
                        $(".input-address").val(selectedAddress);
                        $(".autocomplete-results").empty();
                    });
                });
            });

        } else {
            $(".autocomplete-results").empty();
        }
    });
});

/**
 * Checks if cookie exists
 */
function checkCookie() {
    setTimeout(() => {
        let cookie = document.cookie.indexOf("CookieBy=MealvityWeb"); // Check if cookie exists
        if (cookie === -1) {
            $(".cookie-wrapper-container").toggleClass("active");
        }
    }, 500);
}

function showDiscountForm() {
    $("body").mouseleave(function () {
        if (!localStorage.getItem("newsletter-form-displayed")) {
            $(".discount-form-container").toggleClass("active");
            localStorage.setItem("newsletter-form-displayed", true);
        }
    });

    $("#discount-form-close-btn").click(function (e) {
        e.preventDefault();
        $(".discount-form-container").toggleClass("active");
    });
}

function settingsModal() {
    $("#input-font-size").val(localStorage.getItem("font-size") || 1);
    $("#input-background-color").val(localStorage.getItem("background-color") || "");
    $("#input-mode").val(localStorage.getItem("mode") || "normal");

    $("#settings-icon").click(function (e) {
        e.preventDefault();
        $(".settings-modal-container").toggleClass("active");
    });

    $("#close-settings-modal").click(function (e) {
        e.preventDefault();
        $(".settings-modal-container").toggleClass("active");
    });

    /** Changing the font-size value **/
    $("#input-font-size").change(function (e) {
        e.preventDefault();

        let fontSize = $("#input-font-size").val();
        localStorage.setItem("font-size", fontSize);
        $(".var-font-type").css("font-size", `var(--font-type-${fontSize})`);
        $(".var-font-type-paragraph").css("font-size", `var(--font-type-paragraph-${fontSize})`);
    });

    /** Changing the background color valye **/
    $("#input-background-color").change(function (e) {
        e.preventDefault();

        let backgroundColor = $("#input-background-color").val();
        localStorage.setItem("background-color", backgroundColor);
        $("body").css("background-color", `#${backgroundColor}`);
    });

    /** Changing the mode value **/
    $("#input-mode").change(function (e) {
        e.preventDefault();

        let mode = $("#input-mode").val();
        localStorage.setItem("mode", mode);
        console.log(mode);
        $(":root").css("--color-primary", `var(--${mode}-mode-color-primary)`);
        $(":root").css("--color-accent", `var(--${mode}-mode-color-accent)`);
        $(":root").css("--white", `var(--${mode}-mode-white)`);
        $(":root").css("--black", `var(--${mode}-mode-black)`);
        $(":root").css("--text-primary", `var(--${mode}-mode-text-primary)`);
        $(":root").css("--color-accent-dark", `var(--${mode}-mode-color-accent-dark)`);
    });

    /** Reset button **/
    $("#settings-modal-btn-reset").click(function (e) {
        e.preventDefault();

    });
}

/**
 * Fetches address results with the given input
 * Endpoint used: https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autosuggest-brief.html
 * For more info about the API: https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html
 */
async function fetchAutocomplete(address) {
    const response = await fetch(`https://mealvity-web-api.herokuapp.com/autocomplete/${address}`);
    const autocomplete_json = await response.json();

    $(".autocomplete-results").empty();
    autocomplete_json.items.map(result => {
        createAutocompleteResult(result.title)
    });
}

/**
 * Creates a div containing the address
 * @param {string} address Address
 */
function createAutocompleteResult(address) {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultDiv.textContent = address;
    autocompleteResultsDiv.appendChild(resultDiv);
}