const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const productsFilePath = './product-fixtures.json';

// GET /products
app.get('/products', (req, res) => {
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read file' });
    }

    const products = JSON.parse(data);
    res.json(products);
  });
});

// GET /products/:sku
app.get('/products/:sku', (req, res) => {
  const sku = req.params.sku;

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read file' });
    }

    const products = JSON.parse(data);
    const product = products.find((product) => product.sku === sku);

    if (!product) {
      return res.status(404).json({ error: `Product with SKU ${sku} not found` });
    }

    res.json(product);
  });
});

// PUT /products/:id
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const productUpdates = req.body;

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read file' });
    }

    const products = JSON.parse(data);
    const index = products.findIndex((product) => product.id === productId);

    if (index === -1) {
      return res.status(404).json({ error: `Product with ID ${productId} not found` });
    }

    const updatedProduct = { ...products[index], ...productUpdates };
    products[index] = updatedProduct;

    fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unable to update product' });
      }

      res.json(updatedProduct);
    });
  });
});

// DELETE /products/:id
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read file' });
    }

    const products = JSON.parse(data);
    const index = products.findIndex((product) => product.id === productId);

    if (index === -1) {
      return res.status(404).json({ error: `Product with ID ${productId} not found` });
    }

    const deletedProduct = products[index];
    products.splice(index, 1);

    fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to delete product' });
      }

      res.json(deletedProduct);
    });
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
