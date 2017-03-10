class TemplatesHandler {
  constructor() {
    this.item = this.item.bind(this);
    this.itemPage = this.itemPage.bind(this);
  }

  slides() {
    const slides = document.querySelector('.slides');
    if (slides) {
      slides.classList.remove('hidden');
    } else {
      const content = document.querySelector('.content');
      const slides = document.createElement('section');
      slides.classList.add('slides', 'js-slides');
      slides.innerHTML = `
        <button class="slides__prev mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">&#10094;</button>
        <button class="slides__next mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">&#10095;</button>`;
      content.insertBefore(slides, content.firstElementChild);

      componentHandler.upgradeElement(slides);
      const buttons = Array.from(slides.querySelectorAll('.mdl-button'));
      buttons.forEach((button) => componentHandler.upgradeElement(button));
    }
  }

  products() {
    const container = document.querySelector('.content__container');
    if (container) {
      container.classList.remove('hidden');
    } else {
      const container = document.createElement('div');
      container.classList.add('content__container');

      container.innerHTML = `
      <section class="content__header">
        <div class="breadcrumbs"></div>
      </section>
      <section class="products"></section>
      <section class="pagination"></section>
      `;

      document.querySelector('.content').appendChild(container);
    }

    const layout = document.querySelector('.layout');
    layout.classList.remove('layout--no-drawer-button');
    layout.classList.add('layout--fixed-drawer');
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
        <div class="item">
        
          <div class="item__image mdl-card__media">
            <img src="${product.img}" height="250px" alt="${product.description}">
          </div>
          
          <div class="item__details">
            <h2 class="">${product.name}</h2>
            <div class="item__timeLeft">Time left: ${timeLeft(product.timeEnd, true)}</div>
            <span class="item__date-small">Listed: ${timeListed(product.timeStart)} / </span>
            <span class="item__date-small">End: ${timeListed(product.timeEnd)}</span>
            <h4 class="item__price">$${product.price}</h4>
            <div> [ bids: <span>${product.bids.length}</span> ]</div>
            <div class="item__bid mdl-textfield mdl-js-textfield">
              <input class="mdl-textfield__input" id = "item__bid-input" type="text" pattern="[0-9]*">
              <label class="mdl-textfield__label" for="item__bid-input">$</label>
            </div>
            <a class="item__button mdl-button mdl-js-button mdl-button--orange" href="#${product.id}">
              Place bid
            </a>
            <div class="">
              ${product.description}
            </div>
           </div>
        </div>
      `;

    function timeListed(timeStart) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
      return new Date(timeStart).toLocaleString('en-US', options);
    }
  }


  filter(filterListeners, Router) {
    const filter = document.querySelector('.filters');
    if (filter) {
      filter.classList.remove('hidden');
    } else {
      const filter = document.createElement('div');
      filter.classList.add('filters');

      filter.innerHTML = `
      <div class="filters__wrapper--search">
        <div class="search-field mdl-textfield mdl-js-textfield">
          <input class="search-field__input mdl-textfield__input" id = "search-field__input" type="text">
          <label class="mdl-textfield__label" for="priceRange__start">Search</label>
        </div>
        <a href="#search" class="mdl-button mdl-js-button mdl-button--primary search-field__button">>></a>
      </div>
      <div class="filters__wrapper">
        <span class="priceRange__name">Price:</span>
        <div class="priceRange mdl-textfield mdl-js-textfield">
          <input class="priceRange__start mdl-textfield__input" id = "priceRange__start" type="text" pattern="[0-9]*">
          <label class="mdl-textfield__label" for="priceRange__start">$</label>
        </div>
        <div class="priceRange mdl-textfield mdl-js-textfield">
          <input class="priceRange__end mdl-textfield__input" id = "priceRange__end" type="text" pattern="[0-9]*">
          <label class="mdl-textfield__label" for="priceRange__end">to $</label>
        </div>
        <a href="#filter" class="mdl-button mdl-js-button mdl-button--primary priceRange__button">>></a>
      </div>      
      <div class="sortRange">
        <a href="#sort" id="sortRange__select" class="mdl-button mdl-js-button mdl-button--primary sortRange__button">
          <span class="sortRange__label">Sort</span>
          <span class="caret-dn"></span>
        </a>
        <div 
        class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect sortRange__items" 
        for="sortRange__select">
          <button class="mdl-menu__item" id="time-ending-soonest">Time: ending soonest</button>
          <button class="mdl-menu__item" id="time-newly-listed">Time: newly listed</button>
          <button class="mdl-menu__item" id="price-lowest-first">Price: lowest first</button>
          <button class="mdl-menu__item" id="price-highest-first">Price: highest first</button>
        </div>
      </div>`;

      const contentHeader = document.querySelector('.content__header');
      contentHeader.insertBefore(filter, contentHeader.firstElementChild);

      componentHandler.upgradeElement(filter.querySelector('.search-field'));

      const priceRanges = Array.from(filter.querySelectorAll('.priceRange'));
      priceRanges.forEach((priceRange) => componentHandler.upgradeElement(priceRange));

      componentHandler.upgradeElement(filter.querySelector('.mdl-menu'));

      filterListeners(Router);
    }
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
    const information = document.createElement('p');
    if (category) {
      information.innerText = 'There are no products in category ' + category + '.';
    } else {
      information.innerText = 'Products for sale currently not available!';
    }
    const products = document.querySelector('.products');
    products.innerHTML = '';
    products.appendChild(information);
  }

  map() {
    const wrapper = document.querySelector('.map');
    if (wrapper) {
      wrapper.classList.remove('hidden');
    } else {
      const  wrapper = document.createElement('div');
      wrapper.classList.add('map');
      const spinner = document.createElement('div');
      spinner.classList.add('mdl-spinner', 'mdl-js-spinner','is-active', 'mdl-spinner--single-color');
      wrapper.appendChild(spinner);
      document.querySelector('.content').appendChild(wrapper);
      componentHandler.upgradeElement(spinner);

      const map = document.createElement('script');
      map.src = "https://api-maps.yandex.ru/services/constructor/1.0/js/?sid=hoR8jnFG8RTQd0O4dQfNtcDs8tKG7h95&amp;width=100%25&amp;height=400&amp;lang=en_US&amp;sourceType=constructor&amp;scroll=true";
      const container = document.createElement('div');
      container.classList.add('map__container--hidden');
      container.appendChild(map);
      wrapper.appendChild(container);
      map.addEventListener('load', () => {
        spinner.remove();
        container.classList.remove('map__container--hidden');
      })
    }
  }

  clean(filtersURL = []) {
    document.dispatchEvent(new Event('cleanInterval'));

    const contentElements = Array.from(document.querySelector('.content').children);
    contentElements.forEach(element => element.classList.add('hidden'));

    const pagination = document.querySelector('.pagination');
    if (pagination) pagination.innerHTML = '';

    const filters = document.querySelector('.filters');
    if (filters) {
      filters.classList.add('hidden');
      if (!filtersURL.includes('filter')) {
        filters.querySelector('.priceRange__start').value = '';
        filters.querySelector('.priceRange__end').value = '';
        const priceRanges = Array.from(filters.querySelectorAll('.priceRange'));
        priceRanges.forEach((priceRange) => priceRange.classList.remove('is-dirty', 'is-focused', 'is-invalid'));

        if (!filtersURL.includes('search')) {
          filters.querySelector('.search-field__input').value = '';
          filters.querySelector('.search-field').classList.remove('is-dirty', 'is-focused', 'is-invalid');
        }
      }
    }

    const layout = document.querySelector('.layout');
    layout.classList.remove('layout--fixed-drawer');
    layout.classList.add('layout--no-drawer-button');
  }

  scrollTop() {
    document.querySelector('.content').scrollTop = 0;
  }
}
