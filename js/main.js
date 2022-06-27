const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
const loadMapBlock = document.querySelector('._load_map')
const windowHeigth = document.documentElement.clientHeight;
const loadMoreBlock = document.querySelector('._load_more');



let lazyImagesPosition = [];
if (lazyImages.length > 0) {
    lazyImages.forEach(img => {
        if (img.dataset.src || img.dataset.scrset) {
            lazyImagesPosition.push(img.getBoundingClientRect().top + pageYOffset);
            lazyScrollCheck()
        }
    })
}

// !Прослушивание скролла относительно всех элементов и вызов функции 

window.addEventListener('scroll', lazyScroll)

function lazyScroll() {
    if(document.querySelectorAll('img[data-src], source[data-srcset]').length > 0) {lazyScrollCheck()};
    if(!loadMapBlock.classList.contains('_loaded')) {getMap()} ;
    if(!loadMoreBlock.classList.contains('_loading')) {loadMore()} ;
}


//! Функция отслеживания скролла для картинок и загрузки их как только скролл дойдет до них
function lazyScrollCheck() {
    let imgIndex = lazyImagesPosition.findIndex(item => pageYOffset > item - windowHeigth)
    if (imgIndex >= 0) {
        if (lazyImages[imgIndex].dataset.src) {
            lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
            lazyImages[imgIndex].removeAttribute('data-src')
        } else if (lazyImages[imgIndex].dataset.srcset) {
            lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
            lazyImages[imgIndex].removeAttribute('data-srcset')
        }
        delete lazyImagesPosition[imgIndex];
    }
}

//!Функция загрузки карты 
function getMap() {
    const loadMapBlockPos = loadMapBlock.getBoundingClientRect().top + pageYOffset;
    if (pageYOffset > loadMapBlockPos - windowHeigth) {
        const loadMapUrl = loadMapBlock.dataset.map;
        if (loadMapUrl) {
            loadMapBlock.insertAdjacentHTML(
                "beforeend",
                `<iframe src="${loadMapUrl}" style="border:0" allowfullscreen="" loading="lazy"></iframe>`
            );
            loadMapBlock.classList.add('_loaded');
        }
    }
}


//! Функция бесконечной загрузки контента
function loadMore() {
    const loadMoreBlockPos = loadMoreBlock.getBoundingClientRect().top + pageYOffset;
    const loadMoreBlockHeigth = loadMoreBlock.offsetHeight;


    if (pageYOffset > (loadMoreBlockPos + loadMoreBlockHeigth) - windowHeigth) {
         getContent()
    }
}


//! Функция запроса контента на сервер и навешивание значка анимации при загрузке
async  function getContent() {
    if(!document.querySelector('._loading_icon')) {
        loadMoreBlock.insertAdjacentHTML(
            "beforeend",
            `<div class="_loading_icon"></div>`
        )
    }
    loadMoreBlock.classList.add('_loading');

    let responce = await fetch('_more.html', {
        method: 'GET',
    });
    if(responce.ok) {
        let result = await responce.text();
        loadMoreBlock.insertAdjacentHTML("beforeend", result)
        loadMoreBlock.classList.remove('_loading');
        if(document.querySelector('._loading_icon')) {
            document.querySelector('._loading_icon').remove()
        } ;

    } else {
        alert('Error!')
    }
}