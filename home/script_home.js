const autocompleteResultsDiv = document.querySelector('.autocomplete-results');
let addressSelected = false;

$(document).ready(function () {
    /** Set current yeat **/
    $("#current-year").text(new Date().getFullYear());

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