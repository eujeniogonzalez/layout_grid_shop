// Common variables
const sliderWrapper = document.querySelector('.reviews_wrapper')
const slider = document.querySelector('.reviews_slider')
const slides = document.getElementsByClassName('slider_item') // (important) this selection is a live collection any changes in DOM is updated in the variable unlike querySelectors
const buttonLeft = document.querySelector('.button_left')
const buttonRight = document.querySelector('.button_right')
const sliderBullets = document.querySelector('.bullets')

let currentSlideNumber = 0
let lastSlideNumber = slides.length - 1

// Infinity slider (start)
// Create bullets
function createSliderBullets() {
    ;[...slides].forEach((s, i) => {
        if (i === 0) {
            sliderBullets.innerHTML += '<div id = "slider_bullet_id_' + s.getAttribute('data-slide-number') + '" class="bullet_item bullet_item_active"></div>'
        } else {
            sliderBullets.innerHTML += '<div id = "slider_bullet_id_' + s.getAttribute('data-slide-number') + '" class="bullet_item"></div>'
        }
    })
}
createSliderBullets()

// Change active bullet and counter value
function changeActiveSliderBullet(currentSlideNumber) {
    let allBullets = document.querySelectorAll('.bullet_item')

    allBullets.forEach((item) => {
        item.classList.remove('bullet_item_active')
    })

    document.querySelector('#slider_bullet_id_' + currentSlideNumber).classList.add('bullet_item_active')
}

// Go to a slide
function goToSlide(slideNumber) {
    ;[...slides].forEach((s, i) => {
        if (100 * (i - slideNumber) === 0) {
            changeActiveSliderBullet(s.getAttribute('data-slide-number'))
        }

        s.style.transform = `translateX(${100 * (i - slideNumber)}%)`
    })
    currentSlideNumber = slideNumber
}
goToSlide(currentSlideNumber)

// Make ready the next slide if current slide is the first or the last slide
function readyNextSlide() {
    // If currentSlide is the last slide, shift the first slide to the end
    if (currentSlideNumber === lastSlideNumber) {
        slides[lastSlideNumber].insertAdjacentElement('afterend', slides[0])
        slides[lastSlideNumber].style.transform = `translateX(${100}%)`
        currentSlideNumber--
    }
    // If currentSlide is the first slide, shift the last slide to the beginning
    if (currentSlideNumber === 0) {
        slides[0].insertAdjacentElement('beforebegin', slides[lastSlideNumber])
        slides[0].style.transform = `translateX(-${100}%)`
        currentSlideNumber++
    }
}

// Put the last slide in the beginning
if (currentSlideNumber === lastSlideNumber || currentSlideNumber === 0) readyNextSlide()

// Shift all slides left or right based on direction provided
function shiftSlides(direction) {
    direction ? currentSlideNumber++ : currentSlideNumber--
    if (currentSlideNumber === lastSlideNumber || currentSlideNumber === 0) readyNextSlide()
    goToSlide(currentSlideNumber)
}

// Button click events
buttonRight.addEventListener('click', shiftSlides.bind(null, 1))
buttonLeft.addEventListener('click', shiftSlides.bind(null, 0))

// Loop slider (start)
let autoSlide
addEventListener('DOMContentLoaded', () => {
    autoSlide = setInterval(() => {
        shiftSlides(true)
    }, 4000)
})

sliderWrapper.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
        shiftSlides(true)
    }, 4000)
})

sliderWrapper.addEventListener('mouseover', () => {
    clearInterval(autoSlide)
})
// Loop slider (end)

// Swipes
slider.addEventListener('touchstart', handleTouchStart, false)
slider.addEventListener('touchmove', handleTouchMove, false)

let xDown = null
let yDown = null

function getTouches(evt) {
    return (
        evt.touches || // browser API
        evt.originalEvent.touches
    ) // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0]
    xDown = firstTouch.clientX
    yDown = firstTouch.clientY
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return
    }

    let xUp = evt.touches[0].clientX
    let yUp = evt.touches[0].clientY

    let xDiff = xDown - xUp
    let yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            // left swipe
            shiftSlides(1)
        } else {
            // right swipe
            shiftSlides(0)
        }
    }

    xDown = null
    yDown = null
}
// Infinity slider (end)

// Responsive slider height (start)
function setSliderMaxHeight() {
    let sliderItemMaxHeight = 0

    // Reset max height
    for (let sliderItem of Object.values(slides)) {
        sliderItem.style.minHeight = 'auto'
    }

    // Find slide with max heighr
    for (let sliderItem of Object.values(slides)) {
        if (sliderItemMaxHeight < sliderItem.offsetHeight) {
            sliderItemMaxHeight = sliderItem.offsetHeight
        }
    }

    // Set max height to slider wrapper
    slider.style.height = sliderItemMaxHeight + 'px'
    
    // Set max height to all slides
    for (let sliderItem of Object.values(slides)) {
        sliderItem.style.minHeight = sliderItemMaxHeight + 'px'
    }
}

window.addEventListener('load', function () {
    setSliderMaxHeight()
})

window.addEventListener('resize', function () {
    setSliderMaxHeight()
})
// Responsive slider height (end)


// Responsive accordion catalog (start)
const catalogBtn = document.querySelector('.header_catalog_btn')
const screenToner = document.querySelector('.catalog_screen_toner')
const catalog = document.querySelector('.catalog')
const closeCatalogBtn = document.querySelector('.catalog_close')

catalogBtn.addEventListener('click', openCatalog);
screenToner.addEventListener('click', closeCatalog);
closeCatalogBtn.addEventListener('click', closeCatalog);

window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
        closeCatalog()
    }
})

function openCatalog() {
    screenToner.style.display = 'block'
    catalog.style.transition = `width 0.5s ease-out`;
    catalog.style.width = 600 + 'px'
}

function closeCatalog() {
    catalog.style.transition = 'none';
    catalog.style.width = 0 + 'px'
    screenToner.style.display = 'none'
}

// Nav
document.querySelector('.root-nav').onclick = function(event) {

    if (event.target.nodeName !== 'SPAN') return

    // closeAllSubMenu(event.target.nextElementSibling)
    
    event.target.classList.toggle('submenu-active-span')
    event.target.nextElementSibling.classList.toggle('submenu-active')
}

function closeAllSubMenu(currentMenu = null) {

    const parents = []

    if (currentMenu) {
        let currentParent = currentMenu.parentNode
        while(currentParent) {
            if (currentParent.classList.contains('root-nav')) break
            if (currentParent.nodeName === 'UL') parents.push(currentParent)
            currentParent = currentParent.parentNode
        }
    }

    const allSubMenu = document.querySelectorAll('.sub-nav')
    Array.from(allSubMenu).forEach(item => {
        if (item !== currentMenu && !parents.includes(item)) {
            item.classList.remove('submenu-active')
            if (item.previousElementSibling.nodeName === 'SPAN') {
                item.previousElementSibling.classList.remove('submenu-active-span')
            }
        }
    })
}

// Responsive accordion catalog (end)