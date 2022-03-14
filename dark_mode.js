$(document).ready(function () {
    let fontSize = localStorage.getItem("font-size") || 1;
    let backgroundColor = localStorage.getItem("background-color") || null;
    let mode = localStorage.getItem("mode") || "normal";

    $(".var-font-type").css("font-size", `var(--font-type-${fontSize})`);
    $(".var-font-type-paragraph").css("font-size", `var(--font-type-paragraph-${fontSize})`);

    if (backgroundColor) {
        console.log("Hola")
        $("body").css("background-color", `#${backgroundColor}`);
    }

    $(":root").css("--color-primary", `var(--${mode}-mode-color-primary)`);
    $(":root").css("--color-accent", `var(--${mode}-mode-color-accent)`);
    $(":root").css("--white", `var(--${mode}-mode-white)`);
    $(":root").css("--black", `var(--${mode}-mode-black)`);
    $(":root").css("--text-primary", `var(--${mode}-mode-text-primary)`);
    $(":root").css("--color-accent-dark", `var(--${mode}-mode-color-accent-dark)`);
});