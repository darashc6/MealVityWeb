const inputAddress = document.querySelector('.input-address');
const btnSearch = document.querySelector('#btn-search');
const autocompleteResultsDiv = document.querySelector('.autocomplete-results');
let addressSelected = false;

inputAddress.addEventListener('input', async () => {
    if (inputAddress.value.length !== 0) {
        if (addressSelected && inputAddress.value !== sessionStorage.getItem('address')) {
            addressSelected = false;
        }

        await fetchAutocomplete();

        const results = document.querySelectorAll('.result');
        results.forEach(result => {
            result.addEventListener('click', () => {
                inputAddress.value = result.textContent;
                addressSelected = true;
                sessionStorage.setItem("address", inputAddress.value)
                autocompleteResultsDiv.innerHTML = '';
            });
        });

    } else {
        autocompleteResultsDiv.innerHTML = '';
    }
});

btnSearch.addEventListener('click', () => {
    if (inputAddress.value.length !== 0) {
        if (addressSelected) {
            location.href = "search_results/search_results.html"
        } else {
            alert('Please select a valid address')
            inputAddress.focus();
        }
        console.log(addressSelected)
    } else {
        alert('Please enter a valid address')
        inputAddress.focus();
    }
});

/**
 * Fetches address results with the given input
 * Endpoint used: https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autosuggest-brief.html
 * For more info about the API: https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html
 */
async function fetchAutocomplete() {
    const response = await fetch(`/autocomplete/${inputAddress.value}`);
    const autocomplete_json = await response.json();

    autocompleteResultsDiv.innerHTML = '';
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