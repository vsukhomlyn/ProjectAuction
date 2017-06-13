const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const app = express();
  mongoose.connect('mongodb://localhost:27017/auction_db');

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    img: String,
    timeStart: Date,
    timeEnd: Date,
    category: String,
    bids: [Number]
  });

const Product = mongoose.model("Product", productSchema);

  app.use(express.static('.tmp'));
  app.use(express.static('app'));
  app.use(bodyparser.json());
  app.get('/products', (req, res) => {
    Product.find((err, products) => {
      if (err) res.json([]);
      res.json(products);
    });
  });

  app.post('/newproduct', (req, res) => {
    const productInfo = req.body; //Get the parsed information
    const newProduct = new Product(productInfo);
    newProduct.save((err, Product) => {
      if (err) {
        res.json([]);
      } else {
        res.json(Product);
      }
    });
  });

  app.post('/newbid', (req, res) => {
    const product = req.body; //Get the parsed information
    Product.findByIdAndUpdate(product._id, product,(err, oldProduct) => {
      if (err) {
        res.json([]);
      } else {
        Product.findById(product._id,(err, newProduct) => {
          if (err) {
            res.json([]);
          } else {
            res.json(newProduct);
          }
        });
      }
    });
  });

  app.listen(3000);
