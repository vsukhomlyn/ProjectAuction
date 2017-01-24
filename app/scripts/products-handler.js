
class ProductsHandler {

  getProducts(page, category) {
    if (Products.items) return Products.displayProducts(Products.pagePaginate(Products.items, page, category));

    fetch('./products.json')
      .then(function(response) {
        if (response.headers.get('Content-Type') == 'application/json' && response.status == 200) {
          return response.json();
        }
      })
      .then((products) => this.checkProducts_(products))
      .then((items) => this.pagePaginate (items, page, category))
      .then((filterItems) => this.displayProducts (filterItems))
      .catch(this.displayNothing);
  }

  checkProducts_ (products) {
    const items = products.filter(product => Object.keys(product).length > 0 && this.timeLeft_(product.timeEnd));
    if (items.length == 0) return this.displayNothing();
    return this.items = items;
  }

  pagePaginate(items, page, category) {
    let filterItems = items.slice();
    if (category) {
      filterItems = items.filter(item => item.category == category);
      if (filterItems.length == 0) {
        this.displayNothing(category);
        return filterItems;
      }
    }
    const pagesQuantity = Math.ceil(filterItems.length / ItemsPagination.itemsPerPage);
    ItemsPagination.init(pagesQuantity, page, category);
    let start = 0;
    if (page) start = (Number(page.substr(4)) - 1) * ItemsPagination.itemsPerPage;
    return filterItems.slice(start, start + ItemsPagination.itemsPerPage);
  }

  displayProducts (products) {
    if (products.length == 0) return;

    function template(strings, ...interpolatedValues) {
      return strings.reduce((total, current, index) => {
        total += current;
        if (interpolatedValues.hasOwnProperty(index)) {
          total += String(interpolatedValues[index]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        return total;
      }, '');
    }

    document.querySelector('.products').innerHTML = products.map(product => template`       
        <div class="product mdl-card mdl-shadow--2dp">
          <div class="mdl-card__media">
            <a href="#${product.id}"><img src="${product.img}" height="250px" alt="${product.description}"></a>
          </div>
          <div class="mdl-card__title">
            <a class="mdl-card__title-link" href="#${product.id}">
              <h2 class="mdl-card__title-text">${product.name}</h2>
            </a>
            <h2 class="mdl-card__title-text">$${product.price}</h2>
          </div>
          <div class="mdl-card__supporting-text">
            ${product.description}
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--orange" href="#${product.id}">
              Place bid
            </a>
            <div class="product__timeLeft">${this.timeLeft_(product.timeEnd)} left</div>
          </div>  
        </div>
      `
    ).join('');
  }

  timeLeft_(timeEndStr) {
    const timeEnd = new Date(timeEndStr);
    let left = new Date(timeEnd - Date.now());
    if (left < 0) return false;
    const days = left.getUTCDay() == 0 ? '' : left.getUTCDay() + "d ";

    return ( days + left.getUTCHours() + "h " + left.getUTCMinutes() + "m");
  }

  displayNothing (category) {
    const information = document.createElement('h2');
    if (category) {
      information.innerText = 'There are no products in category ' + category + '.';
    } else {
      information.innerText = 'Products for sale currently not available!';
    }
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = '';
    productsContainer.appendChild(information);
    document.querySelector('.pagination').innerHTML = '';
  }

}

const ItemsPagination = new Pagination (document.querySelector('.pagination'), {
  page: 1,  // selected page
  step: 2,   // pages before and after current
  itemsPerPage: 8 // items per page
});
const Products = new ProductsHandler();
const Router = new Grapnel();

Router.get('', () => Products.getProducts());
Router.get('/:page', (req) => Products.getProducts(req.params.page));
Router.get('/:category/:page', (req) => Products.getProducts(req.params.page, req.params.category));





