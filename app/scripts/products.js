
class ProductsHandler {
  constructor() {
    this.filterListeners = this.filterListeners.bind(this);
    this.timeLeftUpdate_ = this.timeLeftUpdate_.bind(this);
    this.placeBid_ = this.placeBid_.bind(this);
  }

  getProducts (filter = []) {
    if (filter.includes('filter')) {
      return Promise.resolve(this.filteredItems);
    } else if (filter.includes('search')) {
      return Promise.resolve(this.foundItems);
    } else if (this.items) {
      return Promise.resolve(this.items);
    }

    return fetch('./products.json')
      .then(response => {
        if (response.headers.get('Content-Type') === 'application/json' && response.status === 200) {
          return response.json();
        }
      })
      .then(products => this.items = this.checkProducts_(products))
      .catch(console.log);
  }

  checkProducts_ (products) {
    return products.filter(product => Object.keys(product).length > 0 && this.timeLeft_(product.timeEnd));
  }

  timeLeft_(timeEndStr, isItemPage) {
    const timeEnd = new Date(timeEndStr);
    let left = new Date(timeEnd - Date.now());
    if (left < 0) return false;

    const days = left.getUTCDate() -1 == 0 ? '' : left.getUTCDate() -1 + "d ";
    const hours = left.getUTCHours() == 0 ? '' : left.getUTCHours() + "h ";
    const minutes = left.getUTCMinutes() == 0 ? '' : left.getUTCMinutes() + "m";
    let result = days + hours + minutes;
    if (isItemPage) result += " " + left.getUTCSeconds() + "s";
    return result;
  }

  displayProducts (products, template, itemsPerPage, page = 1) {
    let productsPerPage;
    if (itemsPerPage) {
      const start = (Number(page) - 1) * itemsPerPage;
      productsPerPage = products.slice(start, start + itemsPerPage);
    } else {
      productsPerPage = products;
    }
    document.querySelector('.products').innerHTML = productsPerPage
      .map(product  => template(product, this.timeLeft_))
      .join('');

    if (!itemsPerPage) {
      this.timeLeftUpdate_(productsPerPage[0]);
      componentHandler.upgradeElement(document.querySelector('.item__bid'));
      componentHandler.upgradeElement(document.querySelector('.item__button'));
    }
  }

  timeLeftUpdate_ (product) {
    const timeLeft = document.querySelector('.item__timeLeft');
    this.interval = setInterval(() => {
      const time = this.timeLeft_(product.timeEnd, true);
      if (time) {
        timeLeft.innerText = 'Time left: ' + time;
      } else {
        document.dispatchEvent(new Event('cleanInterval'));
        timeLeft.innerText = '';
        const timeEnd = document.createElement('h4');
        timeEnd.classList.add('item__time-end');
        timeEnd.innerText = product.bids.length > 0 ? 'SOLD' : 'END';
        timeLeft.appendChild(timeEnd);
        document.querySelector('.item__button').setAttribute('disabled', 'disabled');
      }
    }, 1000);
    document.addEventListener('cleanInterval', () => {
      clearInterval(this.interval);
    });
  }

  placeBid_ (product) {

    document.querySelector('.item__button').addEventListener('click', () => {
      const bid = document.getElementById('item__bid-input').value;
      if (Number(bid) > Number(product.price)) {

      }
    })
  }

  select (products, filterKey, filterValue) {
    return products.filter(product => product[filterKey] === filterValue);
  }

  filterListeners (Router) {
    let InitialHash;
    function getInitialHash (button) {
      document.querySelector(button).addEventListener('click', () => InitialHash  = window.location.hash);
    }

    getInitialHash('.search-field__button');
    getInitialHash('.priceRange__button');
    getInitialHash('.sortRange__button');
    document.querySelector('.search-field__button').addEventListener('click', () => {
      this.searchFilter(Router, InitialHash);
    });
    document.querySelector('.priceRange__button').addEventListener('click', () => {
      this.priceFilter(Router, InitialHash);
    });
    document.querySelector('.sortRange__items').addEventListener('click', (event) => {
      this.sortFilter(event, Router, InitialHash);
    });
  }

  searchFilter(Router, initialHash) {
    const findValue = document.getElementById('search-field__input').value;
    function returnInitialHash() {
      setTimeout(() => window.location.hash = initialHash, 0);
    }
    if (findValue === '') {
      returnInitialHash();
      return;
    }
    this.foundItems = this.items.filter((item) => item.name.toLowerCase().indexOf(findValue.toLowerCase()) !== -1);

    setTimeout(() => Router.navigate('#/page1?search'), 0);
    return true;
  }

  priceFilter (Router, initialHash) {
    const priceRangeStart = document.getElementById('priceRange__start').value;
    const priceRangeEnd = document.getElementById('priceRange__end').value;
    function returnInitialHash() {
      setTimeout(() => window.location.hash = initialHash, 0);
    }
    if (priceRangeStart === '' && priceRangeEnd === '') {
      returnInitialHash();
      return;
    }

    const priceRangeStartNumber = Number(priceRangeStart) || 0;
    const priceRangeEndNumber = Number(priceRangeEnd) || Number.MAX_VALUE;
    if (priceRangeEndNumber < priceRangeStartNumber) {
      returnInitialHash();
      return;
    }

    let items;
    let search = '';
    if (initialHash.indexOf('search') !== -1) {
      items = this.foundItems;
      search = '?search';
    } else {
      items = this.items;
    }

    this.filteredItems = items.filter((item) => {
      return Number(item.price) >= priceRangeStartNumber && Number(item.price) <= priceRangeEndNumber;
    });

    let targetHash = initialHash.replace(new RegExp('page[0-9]*'), 'page1');
    if (targetHash === '') targetHash = '#/page1';
    setTimeout(() => Router.navigate(targetHash.substr(1).split('?')[0] + search + '?filter'), 0);
    return true;
  }

  sortFilter (event, Router, InitialHash) {
    if (event.target.classList.contains('mdl-menu__item')) {
      document.querySelector('.sortRange__label').innerText = event.target.innerText;

      switch (event.target.id) {
        case 'time-ending-soonest':
          this.items.sort((item1, item2) => Date.parse(item1.timeEnd) - Date.parse(item2.timeEnd));
          break;
        case 'time-newly-listed':
          this.items.sort((item1, item2) => Date.parse(item2.timeStart) - Date.parse(item1.timeStart));
          break;
        case 'price-lowest-first':
          this.items.sort((item1, item2) => item1.price - item2.price);
          break;
        case 'price-highest-first':
          this.items.sort((item1, item2) => item2.price - item1.price);
          break;
      }

      if (this.priceFilter(Router, InitialHash) !== true && this.searchFilter(Router, InitialHash) !== true) {
       Router.navigate(InitialHash.substr(1));
      }
    }
  }
}
