
const Router = new Grapnel();
const Templates = new TemplatesHandler();
const Products = new ProductsHandler();
const Pagination = new PaginationHandler('.pagination', {
  page: 1,  // selected page
  step: 2,   // pages before and after current
  itemsPerPage: 8 // items per page
});

Router.get('', () => {
  Templates.clean();
  Templates.scrollTop();
  Templates.slides();
  Templates.products();
  Products.getProducts().then (products => {
    if (!products.length) return Templates.displayNothing();
    Templates.filter(Products.filterListeners, Router);
    Pagination.init(products);
    Products.displayProducts(products, Templates.item, Pagination.itemsPerPage);
  })
});

Router.get('/page:pageNumber', (req) => {
  const filterArray = req.params.pageNumber.split('?');
  const pageNumber = filterArray[0];
  const filter = filterArray.slice(1);
  Templates.clean(filter);
  Templates.scrollTop();
  Templates.products();
  Templates.filter(Products.filterListeners, Router);
  Products.getProducts(filter).then (products => {
    Pagination.init(products, pageNumber, filter);
    Products.displayProducts(products, Templates.item, Pagination.itemsPerPage, pageNumber);
  })
});

Router.get('/:category/page:pageNumber', (req) => {
  const filterArray = req.params.pageNumber.split('?');
  const pageNumber = filterArray[0];
  const filter = filterArray.slice(1);
  Templates.clean(filter);
  Templates.scrollTop();
  Templates.products();

  Products.getProducts(filter).then (products => {
    const filteredProducts = Products.select(products, 'category', req.params.category);
    Pagination.init(filteredProducts, pageNumber, filter, req.params.category);
    Templates.filter(Products.filterListeners, Router);

    if (!filteredProducts.length) return Templates.displayNothing(req.params.category);

    Products.displayProducts(filteredProducts, Templates.item, Pagination.itemsPerPage, pageNumber);
  })
});

Router.get('/:category/id:id', (req) => {
  Templates.clean();
  Templates.scrollTop();
  Templates.products();
  Products.getProducts().then (products => {
    const product = Products.select(products, 'id', req.params.id);
    Pagination.productBreadcrumb(product);
    Pagination.selectDrawerLink(product[0].category);
    Products.displayProducts(product, Templates.itemPage);
  })
});

Router.get('map', () => {
  Templates.clean('');
  Templates.scrollTop();
  Templates.map();
});
