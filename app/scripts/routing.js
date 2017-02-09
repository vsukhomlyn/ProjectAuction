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
    Pagination.init(products);
    Products.displayProducts(products, Templates.item, Pagination.itemsPerPage);
  })
});

Router.get('/page:pageNumber', (req) => {
  Templates.clean();
  Templates.scrollTop();
  Templates.products();
  Products.getProducts().then (products => {
    Pagination.init(products, req.params.pageNumber);
    Products.displayProducts(products, Templates.item, Pagination.itemsPerPage, req.params.pageNumber);
  })
});

Router.get('/:category/page:pageNumber', (req) => {
  Templates.clean();
  Templates.scrollTop();
  Templates.products();
  Products.getProducts().then (products => {
    const filteredProducts = Products.filter(products, 'category', req.params.category);
    if (!filteredProducts.length) return Templates.displayNothing(req.params.category);
    Pagination.init(filteredProducts, req.params.pageNumber, req.params.category);
    Products.displayProducts(filteredProducts, Templates.item, Pagination.itemsPerPage, req.params.pageNumber);
  })
});

Router.get('/:category/id:id', (req) => {
  Templates.clean();
  Templates.scrollTop();
  Templates.products();
  Products.getProducts().then (products => {
    const product = Products.filter(products, 'id', req.params.id);
    Pagination.productBreadcrumb(product);
    Products.displayProducts(product, Templates.itemPage);
  })
});

Router.get('map', () => {
  Templates.clean();
  Templates.scrollTop();
  Templates.map();
});
