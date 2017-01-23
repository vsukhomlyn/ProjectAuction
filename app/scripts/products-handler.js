
class ProductsHandler {

  getProducts() {
    fetch('./products.json')
      .then(function(response) {
        if (response.headers.get('Content-Type') == 'application/json' && response.status == 200) {
          return response.json();
        }
      })
      .then((products) => this.checkProducts(products))
      .then((products) => this.displayProducts(products))
      .catch(this.displayNothing);
  }

  checkProducts (oldProducts) {
    const newProducts = [];
    oldProducts.forEach((product) => {
      if (Object.keys(product).length > 0 && this.timeLeft(product.timeEnd)) newProducts.push(product);
    });
    if (newProducts.length == 0) return this.displayNothing();
    return newProducts;
  }

  displayProducts (products) {
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
            <div class="product__timeLeft">${this.timeLeft(product.timeEnd)} left</div>
          </div>  
        </div>
      `
    ).join('');
  }

  timeLeft(timeEndStr) {
    const timeEnd = new Date(timeEndStr);
    let left = new Date(timeEnd - Date.now());
    if (left < 0) return false;
    const days = left.getUTCDay() == 0 ? '' : left.getUTCDay() + "d ";

    return ( days + left.getUTCHours() + "h " + left.getUTCMinutes() + "m");
  }

  displayNothing () {
    const information = document.createElement('h2');
    information.innerText = 'Products for sale currently not available!';
    document.querySelector('.products').appendChild(information);
  }

}

const Products = new ProductsHandler();
Products.getProducts();

