let restaurantsList = []; // List of restaurants 
let categoriesList = []; // List of categories
let selectedCategories = []; // List of selected categories
let extraParameters = ['', 1, false]; // Extra parameters used in the search query

const searchResultsContainer = document.querySelector('.search-results-container');
const filterByCategoriesOptions = document.querySelector('.filter-by-categories-options');
const filterByPricesOptions = document.querySelector('.filter-by-prices-options');
const resultLoader = document.querySelector('.result-loader');
const loader = document.querySelector('.loader');

let radioSortBy = document.querySelectorAll('.radio-input');
let currentRadioValue = 'best-match';
radioSortBy.forEach((radio) => {
    radio.addEventListener('click', () => {
        if (currentRadioValue !== radio.value) {
            currentRadioValue = radio.value;
            sortRestaurantList(currentRadioValue, restaurantsList);
        }
    });
});

const inputDistance = document.querySelector('.input-distance');
const checkboxOpen = document.querySelector('.checkbox-open');
const checkboxPrice = document.querySelectorAll('.checkbox-price');

checkboxPrice.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (inputDistance.value !== '') {
            filterParameters();
        }
    })
})

inputDistance.addEventListener('input', () => {
    if (inputDistance.value > 40) {
        inputDistance.value = 40;
    } else if (inputDistance.value < 1) {
        inputDistance.value = 1;
    }

    if (inputDistance.value !== '') {
        filterParameters();
    }
});

checkboxOpen.addEventListener('change', () => {
    if (inputDistance.value !== '') {
        filterParameters();
    }
});

const filterToggle = document.querySelector('#filter-toggle');
const searchFilterContainer = document.querySelector('.search-filter-container');
let filterTabOpen = false; // True if the filter tab is open, false if otherwise

filterToggle.addEventListener('click', () => {
    if (!filterTabOpen) {
        filterTabOpen = true
        openFilterTab();
    } else {
        filterTabOpen = false;
        closeFilterTab();
    }
    document.body.style.transition = 'background-color 0.7s'
    searchResultsContainer.style.transition = 'opacity 0.7s'
    searchFilterContainer.style.transition = 'top 0.7s'
});

window.addEventListener('resize', () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 900) {
        if (filterTabOpen) {
            filterTabOpen = false;
            closeFilterTab();

            document.body.style.transition = 'none'
            searchResultsContainer.style.transition = 'none'
            searchFilterContainer.style.transition = 'none'
        }
    }
})

/**
 * Creates a 'div' container for each Restaurant from the restaurantList
 * @param {object} restaurantData Object containing restaurant data
 */
function createRestaurantContainer(restaurantData) {
    const restaurantHTML = `<div class="result-container">
    <img class="restaurant-image" src="${restaurantData.image_url}" alt="Restaurant Image">
    <div class="restaurant-content">
        <div class="restaurant-name">
            ${restaurantData.name}
        </div>
        <div class="restaurant-details">
            <div>
                <img src="images/spoon.png" alt="Cusine">
                <label>${displayAllCategories(restaurantData.categories)}</label>
            </div>
            <div>
                <img src="images/pin.png" alt="Address">
                <label>${restaurantData.location.address1}</label>
            </div>
            <div>
                <img src="images/euro.png" alt="Price">
                <label>${restaurantData.price}</label>
            </div>
            <div>
                <img src="images/distance.png" alt="Distance">
                <label>${Math.floor(restaurantData.distance)} m</label>
            </div>
            <div>
                <img src="images/star.png" alt="Rating">
                <label>${restaurantData.rating}</label>
            </div>
        </div>
        <div class="external-links">
            <div class="yelp-external-link">
                <p class="external-link-name">Visit Yelp</p>
                <img src="images/yelp.svg" alt="Yelp">
            </div>
            <div class="google-maps-external-link">
                <p class="external-link-name">Google Maps</p>
                <img src="images/google-maps.svg" alt="Google Maps">
            </div>
        </div>
    </div>
    </div>`

    searchResultsContainer.insertAdjacentHTML('beforeend', restaurantHTML);
}
/**
 * Fetches from the Yelp Fusion API
 * Endpoint used: https://www.yelp.com/developers/documentation/v3/business_search
 * For more info about the API: https://www.yelp.com/developers/documentation/v3
 * @param {*} extraParams Parameters used in the search query
 */
async function fetchYelp(extraParams) {
    const params = {
        location: sessionStorage.getItem('address')
    };

    if (extraParams[0] !== '') params.price = extraParams[0];
    params.radius = extraParams[1] * 1000;
    if (extraParams[2] === true) params.open_now = extraParams[2];

    try {
        const response = await fetch(`https://mealvity-web-api.herokuapp.com/business_search/${JSON.stringify(params)}`);
        const json = await response.json();
        const totalRestaurants = json.businesses;
        restaurantsList = [];
        categoriesList = [];
        selectedCategories = [];

        // Some objects from the JSON contains incomplete info, Therefore, we add to a separate list only those objects that have all the info
        totalRestaurants.map(restaurant => {
            if (restaurant.image_url !== "" && restaurant.display_phone !== "" && restaurant.distance !== "" && restaurant.location.address1 !== null && restaurant.price !== undefined) {
                restaurantsList.push(restaurant);
                addCategoryToCategoriesList(restaurant.categories);
            }
        });

        sortRestaurantList(currentRadioValue, restaurantsList);
        setupCategoryOptions();
        showResultsToggle();
    } catch (err) {
        console.error(err);
    }
}

/**
 * Saves the restaurant categories in a different list
 * This list can later be used for filtering
 * @param {*} restaurantCategories Array of Restaurant categories
 */
function addCategoryToCategoriesList(restaurantCategories) {
    restaurantCategories.forEach(category => {
        if (!categoriesList.includes(category.title)) {
            categoriesList.push(category.title);
        }
    });
}

/**
 * Displays each category from categoriesList as a checkbox.
 */
function setupCategoryOptions() {
    filterByCategoriesOptions.innerHTML = '';
    categoriesList.sort().forEach(category => {
        const categoryHTML = `<label class="checkbox">
        <input type="checkbox" class="checkbox-input checkbox-category" value="${category}">
        <div class="checkbox-custom"></div>
        <label>${category}</label>
        </label>`;

        filterByCategoriesOptions.insertAdjacentHTML('beforeend', categoryHTML);
    });


    const checkboxCategories = document.querySelectorAll('.checkbox-category');
    checkboxCategories.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.value);
            } else {
                const index = selectedCategories.indexOf(checkbox.value);
                selectedCategories.splice(index, 1);
            }

            if (selectedCategories.length > 0) {
                filterRestaurantListWithCategories(selectedCategories);
            } else {
                sortRestaurantList(currentRadioValue, restaurantsList);
            }
        });
    });
}

/**
 * Converts the array of Restaurant categories to String
 * @param {*} arrayCategories Array of Restaurant categories
 */
function displayAllCategories(arrayCategories) {
    let stringCategories = "";
    arrayCategories.forEach(category => {
        stringCategories += `${category.title}, `
    });

    return stringCategories.substring(0, stringCategories.length - 2)
}

/**
 * Scans the 'Price', 'Distance' & 'Open Restaurants' checkboxes and adds the results from those checkboxes to a list
 */
function filterParameters() {
    searchResultsContainer.innerHTML = '';
    extraParameters = [];
    if (filterCheckboxPrices() !== '') {
        extraParameters.push(filterCheckboxPrices());
    } else {
        extraParameters.push('');
    }
    extraParameters.push(filterInputDistance());
    extraParameters.push(filterOpenRestaurants());

    showResultsToggle();
    fetchYelp(extraParameters);
}

/**
 * Returns the 'Price' checkboxes checked value in the form of a String, separated of commas
 * @returns String with the checkboxes checked value, separated of commas
 */
function filterCheckboxPrices() {
    let stringPricesSelected = ""
    const checkboxPrice = document.querySelectorAll('.checkbox-price');

    checkboxPrice.forEach(checkbox => {
        if (checkbox.checked) {
            stringPricesSelected += checkbox.value + ','
        }
    });
    return stringPricesSelected.substring(0, stringPricesSelected.length - 1)
}

/**
 * Returns the 'Distance' input value
 * @returns Input value from the 'Distance' form
 */
function filterInputDistance() {
    return inputDistance.value
}

/**
 * Returns the checkbox value from the 'Open Restaurant' form
 * @returns Boolean with the checkbox value from the 'Open Restaurant' form. True is checked, false if otherwise
 */
function filterOpenRestaurants() {
    return checkboxOpen.checked;
}

/**
 * Filters restaurants from the restaurantList containing the selected categories
 * @param {array} selectedCat Array of string with the categories selected
 */
function filterRestaurantListWithCategories(selectedCat) {
    let restaurantListWithCategories = [];
    selectedCat.forEach(selected => {
        console.log(selected);
        restaurantsList.forEach(restaurant => {
            restaurant.categories.forEach(category => {
                if (category.title === selected) {
                    restaurantListWithCategories.push(restaurant);
                }
            });
        });
    });

    sortRestaurantList(currentRadioValue, restaurantListWithCategories);
}

/**
 * Sorts the restaurant list depending on the radio button selected from the 'Sort by' form
 * @param {string} radioValue Value of the radio button selected
 * @param {array} listToFilter restaurant list to filter
 */
function sortRestaurantList(radioValue, listToFilter) {
    searchResultsContainer.innerHTML = ''
    const sortedRestaurantList = listToFilter.slice();
    switch (radioValue) {
        case "best-match":
            displayRestaurantList(sortedRestaurantList);
            break;
        case "ratings":
            sortedRestaurantList.sort((a, b) => {
                return b.rating - a.rating
            });
            displayRestaurantList(sortedRestaurantList);

            break;
        case "distance":
            sortedRestaurantList.sort((a, b) => {
                return a.distance - b.distance;
            });
            displayRestaurantList(sortedRestaurantList);

            break;
        case "cheapest":
            sortedRestaurantList.sort((a, b) => {
                return a.price.length - b.price.length;
            });
            displayRestaurantList(sortedRestaurantList);

            break;
        case "expensive":
            sortedRestaurantList.sort((a, b) => {
                return b.price.length - a.price.length;
            });
            displayRestaurantList(sortedRestaurantList);

            break;
    }
}

/**
 * Displays the restaurant list to the 'search-results-container' div.
 * @param {array} restaurantList The restaurant list to show
 */
function displayRestaurantList(restaurantList) {
    restaurantList.map(restaurant => {
        createRestaurantContainer(restaurant);

        setupYelpLink(restaurant);
        setupGoogleMapsLink(restaurant);
    });
}

/**
 * Sets up a Yelp link to open in a new window
 * @param {*} restaurant Restaurant with the Yelp link
 */
function setupYelpLink(restaurant) {
    const yelpExternalLinks = document.querySelectorAll('.yelp-external-link');

    yelpExternalLinks[yelpExternalLinks.length - 1].addEventListener('click', () => {
        window.open(restaurant.url);
    });
}

/**
 * Sets up a Google Maps link to open in a new window
 * @param {*} restaurant Restaurant with the location coordinates
 */
function setupGoogleMapsLink(restaurant) {
    const googleMapsExternalLinks = document.querySelectorAll('.google-maps-external-link');

    googleMapsExternalLinks[googleMapsExternalLinks.length - 1].addEventListener('click', () => {
        const restaurantName = restaurant.name;
        const restaurantCoordinates = restaurant.coordinates;

        window.open(`https://www.google.com/maps/search/${restaurantName}/@${restaurantCoordinates.latitude},${restaurantCoordinates.longitude}`);
    });
}

/**
 * Uses the 'show-results' style to toggle between the loading animation and the results container
 */
function showResultsToggle() {
    resultLoader.classList.toggle('show-results');
    loader.classList.toggle('show-results');
    searchResultsContainer.classList.toggle('show-results');
}

/**
 * Opens the filter tab when you click on the icon
 * Note: The icon is only displayed in smaller screens
 */
function openFilterTab() {
    document.body.style.backgroundColor = 'var(--color-primary-dark)';
    searchResultsContainer.style.opacity = '0.3'
    searchResultsContainer.style.zIndex = '-99'
    searchFilterContainer.style.top = '90px'
    searchFilterContainer.style.zIndex = '99'
}

/**
 * Closes the filter tab when you click on the icon
 * Note: The icon is only displayed in smaller screens
 */
function closeFilterTab() {
    document.body.style.backgroundColor = 'var(--color-primary)';
    searchResultsContainer.style.opacity = '1'
    searchResultsContainer.style.zIndex = '1'
    searchFilterContainer.style.top = '105%'
    searchFilterContainer.zIndex = '1'
}

fetchYelp(extraParameters);