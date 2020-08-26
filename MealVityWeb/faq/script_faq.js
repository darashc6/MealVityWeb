const accordionItemHeaders = document.querySelectorAll('.accordion-item-header')

accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener('click', () => {
        accordionItemHeader.classList.toggle('active')
        const accordionContent = accordionItemHeader.nextElementSibling

        if (accordionItemHeader.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px'
        } else {
            accordionContent.style.maxHeight = 0
        }
    })
});