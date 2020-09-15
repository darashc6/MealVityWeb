let restaurantsList = [];
const searchResultsContainer = document.querySelector('.search-results-container');

let radioSortBy = document.querySelectorAll('.radio-input');
let prevRadioValue = "best-match";
radioSortBy.forEach((radio) => {
    radio.addEventListener('click', () => {
        if (prevRadioValue !== radio.value) {
            filterRestaurantList(radio.value);
        }
        prevRadioValue = radio.value;
    });
});

let checkboxPrice = document.querySelectorAll('.checkbox-price');
let inputDistance = document.querySelector('.input-distance');
let checkboxOpen = document.querySelector('.checkbox-open');

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

function createContainer(restaurantData) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-container');
    searchResultsContainer.appendChild(resultContainer);

    const restaurantImage = document.createElement('img');
    restaurantImage.classList.add('restaurant-image');
    restaurantImage.src = restaurantData.image_url;
    const restaurantContent = document.createElement('div');
    restaurantContent.classList.add('restaurant-content');
    resultContainer.append(restaurantImage, restaurantContent);

    const restaurantNameDiv = document.createElement('label');
    restaurantNameDiv.classList.add('restaurant-name');
    restaurantNameDiv.textContent = restaurantData.name;
    const restaurantDetailsDiv = document.createElement('div');
    restaurantDetailsDiv.classList.add('restaurant-details');
    restaurantContent.append(restaurantNameDiv, restaurantDetailsDiv);

    const restaurantInfoDiv = document.createElement('div');
    const restaurantInfoDiv2 = document.createElement('div');
    const restaurantInfoDiv3 = document.createElement('div');
    restaurantInfoDiv.classList.add('restaurant-info');
    restaurantInfoDiv2.classList.add('restaurant-info');
    restaurantInfoDiv3.classList.add('restaurant-info');
    restaurantDetailsDiv.append(restaurantInfoDiv, restaurantInfoDiv2, restaurantInfoDiv3);

    const cuisineDiv = document.createElement('div');
    const cuisineImg = document.createElement('img');
    cuisineImg.src = 'images/spoon.png';
    const cuisineLabel = document.createElement('label');
    cuisineLabel.textContent = restaurantData.categories[0].title;
    cuisineDiv.append(cuisineImg, cuisineLabel);
    restaurantInfoDiv.appendChild(cuisineDiv);

    const phoneDiv = document.createElement('div');
    const phoneImg = document.createElement('img');
    phoneImg.src = 'images/phone.png';
    const phoneLabel = document.createElement('label');
    phoneLabel.textContent = restaurantData.phone;
    phoneDiv.append(phoneLabel, phoneImg);
    restaurantInfoDiv.appendChild(phoneDiv);

    const addressDiv = document.createElement('div');
    const addressImg = document.createElement('img');
    addressImg.src = 'images/pin.png';
    const addressLabel = document.createElement('label');
    addressLabel.textContent = restaurantData.location.address1;
    addressDiv.append(addressImg, addressLabel);
    restaurantInfoDiv2.appendChild(addressDiv);

    const distanceDiv = document.createElement('div');
    const distanceImg = document.createElement('img');
    distanceImg.src = 'images/distance.png';
    const distanceLabel = document.createElement('label');
    distanceLabel.textContent = `${Math.floor(restaurantData.distance)} m`;
    distanceDiv.append(distanceLabel, distanceImg);
    restaurantInfoDiv2.appendChild(distanceDiv);

    const ratingDiv = document.createElement('div');
    const ratingImg = document.createElement('img');
    ratingImg.src = 'images/star.png';
    const ratingLabel = document.createElement('label');
    ratingLabel.textContent = restaurantData.rating;
    ratingDiv.append(ratingImg, ratingLabel);
    restaurantInfoDiv3.appendChild(ratingDiv)

    const priceDiv = document.createElement('div');
    const priceImg = document.createElement('img');
    priceImg.src = 'images/euro.png';
    const priceLabel = document.createElement('label');
    priceLabel.textContent = restaurantData.price;
    priceDiv.append(priceLabel, priceImg);
    restaurantInfoDiv3.appendChild(priceDiv);
}

async function fetchYelp(extraParams) {
    const params = {
        location: sessionStorage.getItem('address')
    };

    if (extraParams.length === 0) {
        params.radius = 1000;
    } else {
        if (extraParams[0] !== '') params.price = extraParams[0];
        params.radius = extraParams[1] * 1000;
        if (extraParams[2] === true) params.open_now = extraParams[2];
    }

    const response = await fetch(`/business_search/${JSON.stringify(params)}`);
    const json = await response.json();
    const totalRestaurants = json.businesses;
    restaurantsList = [];

    totalRestaurants.map(restaurant => {
        if (restaurant.image_url !== "" && restaurant.display_phone !== "" && restaurant.distance !== "" && restaurant.location.address1 !== null && restaurant.price !== undefined) {
            restaurantsList.push(restaurant);
        }
    });

    filterRestaurantList(prevRadioValue);
}

function filterParameters() {
    searchResultsContainer.innerHTML = ''
    var extraParameters = []
    if (filterCheckboxPrices() !== '') {
        extraParameters.push(filterCheckboxPrices())
    } else {
        extraParameters.push('')
    }
    extraParameters.push(filterInputDistance())
    extraParameters.push(filterOpenRestaurants())

    fetchYelp(extraParameters)
}

function filterCheckboxPrices() {
    var stringPricesSelected = ""
    checkboxPrice.forEach(checkbox => {
        if (checkbox.checked) {
            stringPricesSelected += checkbox.value + ','
        }
    });
    return stringPricesSelected.substring(0, stringPricesSelected.length - 1)
}

function filterInputDistance() {
    return inputDistance.value
}

function filterOpenRestaurants() {
    if (checkboxOpen.checked) {
        return true
    } else {
        return false
    }
}

function filterRestaurantList(radioValue) {
    searchResultsContainer.innerHTML = ''
    const filteredRestaurantsList = restaurantsList.slice()
    switch (radioValue) {
        case "best-match":
            reorderRestaurantList(restaurantsList);
            break;
        case "ratings":
            filteredRestaurantsList.sort((a, b) => {
                return b.rating - a.rating
            });
            reorderRestaurantList(filteredRestaurantsList);

            break;
        case "distance":
            filteredRestaurantsList.sort((a, b) => {
                return a.distance - b.distance;
            });
            reorderRestaurantList(filteredRestaurantsList);

            break;
        case "cheapest":
            filteredRestaurantsList.sort((a, b) => {
                return a.price.length - b.price.length;
            });
            reorderRestaurantList(filteredRestaurantsList);

            break;
        case "expensive":
            filteredRestaurantsList.sort((a, b) => {
                return b.price.length - a.price.length;
            });
            reorderRestaurantList(filteredRestaurantsList);

            break;
    }
}

function reorderRestaurantList(restaurantList) {
    restaurantList.map(restaurant => {
        createContainer(restaurant);
    });
}

fetchYelp([]);