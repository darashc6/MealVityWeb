$(document).ready(function () {
    $("#settings-icon").click(function (e) {
        e.preventDefault();

        /** Show modal on click **/
        $("body").prepend(`<div class="settings-modal-container">
        <div class="settings-modal">
            <div class="header d-flex align-items-center justify-content-between">
                <h4 class="header-text">Settings</h4>
                <span class="iconify" data-icon="mdi:window-close" id="close-settings-modal"></span>
            </div>

            <div class="content">
                <div class="modal-font-size-option-container">
                    <p>Font type:</p>
                    <input type="number" id="input-font-size" min="1" max="6" maxlength="1" class="form-control">
                </div>
                <div class="modal-background-color-option-container">
                    <p>Background color:</p>
                    <div>
                        <p style="margin: auto 0;">#</p>
                        <input type="text" id="input-background-color" maxlength="6" class="form-control">
                    </div>
                </div>
                <div class="modal-mode-option-container">
                    <p>Mode:</p>
                    <div>
                        <select name="input-mode" id="input-mode">
                            <option value="normal">Normal</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
                <div class="modal-btns">
                    <button type="button" id="settings-modal-btn-reset" class="btn btn-danger">Reset</button>
                </div>
            </div>
        </div>
    </div>`);

        /** Load previously saved settings (if present) **/
        $("#input-font-size").val(localStorage.getItem("font-size") || 1);
        $("#input-background-color").val(localStorage.getItem("background-color") || "");
        $("#input-mode").val(localStorage.getItem("mode") || "normal");

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
            $(":root").css("--color-primary", `var(--${mode}-mode-color-primary)`);
            $(":root").css("--color-accent", `var(--${mode}-mode-color-accent)`);
            $(":root").css("--white", `var(--${mode}-mode-white)`);
            $(":root").css("--black", `var(--${mode}-mode-black)`);
            $(":root").css("--text-primary", `var(--${mode}-mode-text-primary)`);
            $(":root").css("--color-accent-dark", `var(--${mode}-mode-color-accent-dark)`);
        });

        /** Reset changes **/
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

        /** Closing the settings modal **/
        $("body").on('click', "#close-settings-modal", function () {
            $(".settings-modal-container").remove();
        });
    });
});