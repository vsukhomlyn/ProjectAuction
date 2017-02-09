class PaginationHandler {
  constructor(elementSelector, data = {}) {
    this.code = '';
    this.category = '';
    this.elementSelector = elementSelector;
    this.page = data.page || 1;
    this.step = data.step || 2;
    this.itemsPerPage = data.itemsPerPage || 10;
  }

  init (items, page, category) {
    this.pagesQuantity = Math.ceil(items.length / this.itemsPerPage);
    this.page = page ?  Number(page) : 1;
    this.category = category ?  '/' + category : '';
    this.element = document.querySelector(this.elementSelector);
    this.element.addEventListener('click', this.click.bind(this));
    this.construct();
  }

  // construct pagination type
  construct () {
    if (this.pagesQuantity < this.step * 2 + 6) {
      this.add(1, this.pagesQuantity + 1);
    }
    else if (this.page < this.step * 2 + 1) {
      this.add(1, this.step * 2 + 4);
      this.last();
    }
    else if (this.page > this.pagesQuantity - this.step * 2) {
      this.first();
      this.add(this.pagesQuantity - this.step * 2 - 2, this.pagesQuantity + 1);
    }
    else {
      this.first();
      this.add(this.page - this.step, this.page + this.step + 1);
      this.last();
    }
    this.breadcrumb();
    this.insert();
  }

  // add pages by number (from start to finish)
  add (start, finish) {
    for (let i = start; i < finish; i+=1) {
      this.code += '<a>' + i + '</a>';
    }
  }

  // add first page with separator
  first () {
    this.code += '<a>1</a><i>...</i>';
  }

  // add last page with separator
  last () {
    this.code += '<i>...</i><a>' + this.pagesQuantity + '</a>';
  }

  // insert pagination
  insert () {
    this.element.innerHTML = this.code;
    this.code = '';
    const links = Array.from(this.element.getElementsByTagName('a'));
    links.forEach((link, index) => {
      link.classList.add('pagination__item');
      link.setAttribute('href','#' + this.category + '/page' + (index + 1));
      if (Number(link.innerHTML) === this.page) link.classList.add('pagination__item--active');
    });
  }

  // change page
  click (event) {
    if (event.target.classList.contains('pagination__item')) {
      this.page = Number(event.target.innerHTML);
      this.construct();
    }
  }

  breadcrumb () {
   document.querySelector('.breadcrumbs').innerHTML = '<a href="#">main</a> / <a href="#/' +
      this.category.substr(1) + '/page1">' + this.category.substr(1) + '</a>';
  }

  productBreadcrumb ([product]) {
    document.querySelector('.breadcrumbs').innerHTML = '<a href="#">main</a> / <a href="#/' +
      product.category + '/page1">' + product.category + '</a> / <a href="#/' +
      product.category + '/id' + product.id + '">' + product.name + '</a>';
  }
}
