$(document).ready(function () {
    setTimeout(() => {
        let cookie = document.cookie.indexOf("CookieBy=MealvityWeb"); // Check if cookie exists
        if (cookie === -1) {
            $("body").prepend(`<div class="cookie-wrapper-container">
            <div class="cookie-wrapper">
                <p class="cookie-text">
                    We use cookies in this website to give you the best experience on our site and show you relevant ads. To
                    find out more, read our <a href="../privacy_policy/privacy_policy.html" target="_blank"><span
                            class="policy-link" id="privacy-policy-link">privacy
                            policy</span></a> and <a href="../cookie_policy/cookie_policy.html" target="_blank"><span
                            class="policy-link" id="cookie-policy-link">cookie
                            policy</span></a>.
                </p>
    
                <button class="cookie-btn">
                    Okay
                </button>
            </div>
        </div>`);

            sessionStorage.setItem("cookie-wrapper-active", true);
        }
    }, 1000);

    /** Click on cookie button **/
    $("body").on('click', '.cookie-btn', function () {
        // Set cookie for 7 days
        document.cookie = "CookieBy=MealvityWeb; path=/; max-age=" + (60 * 60 * 24 * 7);
        $(".cookie-wrapper-container").remove();
        sessionStorage.setItem("cookie-wrapper-active", false);
    });
});