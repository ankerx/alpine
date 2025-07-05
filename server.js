const express = require('express');
const { Liquid } = require('liquidjs');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;


const engine = new Liquid({
    root: path.join(__dirname, 'templates'), 
    extname: '.liquid'
  })
app.engine('liquid', engine.express()) 
app.set('views', "./templates") 
app.set('view engine', 'liquid') 


app.use(express.static(__dirname));

function loadData(filename) {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return {};
  }
}
app.get('/', function (req, res) {
  res.render('product', {
    title: 'Product Details'
  })
})

app.get('/api/product', (req, res) => {
  const product = loadData('product.json');
  res.json(product);
});



app.get('/api/recommendations', (req, res) => {
  const recommendations = loadData('recommendations.json');
  res.json(recommendations);
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});