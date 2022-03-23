function handleAddToCard(product) {
  let products = localStorage.getItem('products');
  products = products ? JSON.parse(products) : [];

  let countProducts = products.length + 1;
  products.push(JSON.parse(product))
  document.getElementById('count-cart').innerHTML = countProducts;
  localStorage.setItem('products', JSON.stringify(products))
}

