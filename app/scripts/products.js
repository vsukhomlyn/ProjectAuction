
class ProductsHandler {
  getProducts () {
    if (this.items) return Promise.resolve(this.items);
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

  timeLeft_(timeEndStr) {
    const timeEnd = new Date(timeEndStr);
    let left = new Date(timeEnd - Date.now());
    if (left < 0) return false;
    const days = left.getUTCDay() == 0 ? '' : left.getUTCDay() + "d ";
    return ( days + left.getUTCHours() + "h " + left.getUTCMinutes() + "m");
  }

  displayProducts (products, template, itemsPerPage = 1, page = 1) {
    const start = (Number(page) - 1) * itemsPerPage;
    const productsPerPage = products.slice(start, start + itemsPerPage);
    document.querySelector('.products').innerHTML = productsPerPage.map(product  => template(product, this.timeLeft_)).join('');
  }

  filter(products, filterKey, filterValue) {
    return products.filter(product => product[filterKey] === filterValue);
  }
}
