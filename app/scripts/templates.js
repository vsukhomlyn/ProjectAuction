class TemplatesHandler {
  constructor() {
    this.item = this.item.bind(this);
    this.itemPage = this.itemPage.bind(this);
  }

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

  item (product, timeLeft) {
    return this.template_`       
        <div class="product mdl-card mdl-shadow--2dp">
          <div class="mdl-card__media">
            <a href="#/${product.category}/id${product.id}"><img src="${product.img}" height="250px" alt="${product.description}"></a>
          </div>
          <div class="mdl-card__title">
            <a class="mdl-card__title-link" href="#/${product.category}/id${product.id}"">
              <h2 class="mdl-card__title-text">${product.name}</h2>
            </a>
            <h2 class="mdl-card__title-text">$${product.price}</h2>
          </div>
          <div class="mdl-card__supporting-text">
            ${product.description}
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--orange" href="#/${product.category}/id${product.id}"">
              Place bid
            </a>
            <div class="product__timeLeft">${timeLeft(product.timeEnd)} left</div>
          </div>  
        </div>
      `
  }

  itemPage (product, timeLeft) {
    return this.template_`       
        <div class="product product--detail mdl-card mdl-shadow--2dp">
          <div class="mdl-card__media">
            <img src="${product.img}" height="250px" alt="${product.description}">
          </div>
          <div class="mdl-card__detail">
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text">${product.name}</h2>
              <h2 class="mdl-card__title-text">$${product.price}</h2>
            </div>
            <div class="mdl-card__supporting-text">
              ${product.description}
            </div>
            <div class="mdl-card__actions mdl-card--border">
              <a class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--orange" href="#${product.id}">
                Place bid
              </a>
              <div class="product__timeLeft">${timeLeft(product.timeEnd)} left</div>
            </div> 
           </div>
        </div>
      `
  }

  template_(strings, ...interpolatedValues) {
    return strings.reduce((total, current, index) => {
      total += current;
      if (interpolatedValues.hasOwnProperty(index)) {
        total += String(interpolatedValues[index]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      return total;
    }, '');
  }

  displayNothing (category) {
    const information = document.createElement('h4');
    if (category) {
      information.innerText = 'There are no products in category ' + category + '.';
    } else {
      information.innerText = 'Products for sale currently not available!';
    }
    document.querySelector('.products').appendChild(information);
  }

  map() {
    const content = document.querySelector('.content');
    const map = document.createElement('script');
    map.src= "https://api-maps.yandex.ru/services/constructor/1.0/js/?sid=hoR8jnFG8RTQd0O4dQfNtcDs8tKG7h95&amp;width=100%25&amp;height=400&amp;lang=en_US&amp;sourceType=constructor&amp;scroll=true";
    content.appendChild(map);
  }

  clean() {
    document.querySelector('.content').innerHTML = '';
  }

  scrollTop() {
    document.querySelector('.content').scrollTop = 0;
  }
}
