class TemplatesHandler {
  slides() {
    const content = document.querySelector('.content');
    const slides = document.createElement('section');

    slides.classList.add('slides', 'js-slides');
    slides.innerHTML = `
        <button class="slides__prev mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">&#10094;</button>
        <button class="slides__next mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">&#10095;</button>`;
    content.appendChild(slides);

    componentHandler.upgradeElement(slides);
  }

  products() {
    const content = document.querySelector('.content');
    const fragment = document.createDocumentFragment();

    const breadcrumbs = document.createElement('section');
    breadcrumbs.classList.add('breadcrumbs');
    const products = document.createElement('section');
    products.classList.add('products');
    const pagination = document.createElement('section');
    pagination.classList.add('pagination');

    fragment.appendChild(breadcrumbs);
    fragment.appendChild(products);
    fragment.appendChild(pagination);
    content.appendChild(fragment);
  }

  map() {
    const content = document.querySelector('.content');
    const map = document.createElement('script');
    map.src= "https://api-maps.yandex.ru/services/constructor/1.0/js/?sid=hoR8jnFG8RTQd0O4dQfNtcDs8tKG7h95&amp;width=100%25&amp;height=400&amp;lang=ru_RU&amp;sourceType=constructor&amp;scroll=true";
    content.appendChild(map);
  }

  clean() {
    document.querySelector('.content').innerHTML = '';
  }


}
