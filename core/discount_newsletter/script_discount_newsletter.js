$(document).ready(function () {

    /** Show discount form when the mouse leaves the page **/
    $("body").mouseleave(function () {
        let cookieWrapperActive = JSON.parse(sessionStorage.getItem("cookie-wrapper-active"));
        let newsletterFormDisplayed = JSON.parse(localStorage.getItem("newsletter-form-displayed")) || false;

        if (!newsletterFormDisplayed && !cookieWrapperActive) {
            $("body").prepend(`<div class="discount-form-container">
        <div class="discount-form">
            <div class="row">
                <div class="col-md-4 col-12">
                    <img src="../assets/discount_newsletter_image.jpg" alt="discount-newsletter-img" srcset="">
                </div>
                <div class="col-md-8 col-12 text-center row d-flex flex-column align-items-center justify-content-evenly"
                    id="subscription-form">
                    <div class="col-12">
                        <h4>GET 10% OFF</h4>
                        <p>Subscribe and get a promotion for your first order.</p>
                    </div>
                    <form action="#" class="col-10">
                        <div class="input-group">
                            <input class="form-control" id="discount-form-input-email" type="email" name="email"
                                placeholder="Your email">
                        </div>
                        <div class="input-group">
                            <input type="submit" value="Subscribe" class="form-control subscribe-btn">
                        </div>
                    </form>
                    <span id="discount-form-close-btn" class="close-btn">No thanks, I don't like gifts</span>
                </div>
            </div>
        </div>
    </div>`);

            localStorage.setItem("newsletter-form-displayed", true);
        }
    });

    $("body").on('click', '#discount-form-close-btn', function () {
        $(".discount-form-container").remove();
    });
});