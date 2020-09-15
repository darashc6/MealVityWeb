const inputAddress = document.querySelector('.input-address')
const btnSearch = document.querySelector('#btn-search')

btnSearch.addEventListener('click', () => {
    if (inputAddress.value.length !== 0) {
        sessionStorage.setItem("address", inputAddress.value)
        console.log(sessionStorage.getItem("address"))
        location.href = "search_results/search_results.html"
    } else {
        alert('Please enter a valid home address')
        inputAddress.focus();
    }
})
