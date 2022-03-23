function renderItems() {
  let products = localStorage.getItem('products');
  document.getElementById('input-products').value = products
  products = JSON.parse(products || []);

  var tbody = "";
  let total = 0;
  for (var i = 0; i < products.length; i++) {
    total += Number(products[i].precio)
    tbody += `
    <tr>
      <td>${i + 1}</td>
      <td>
        <img src="${products[i].thumbnailUrl}" width="50px" height="50px" alt="${products[i].producto}">
      </td>
      <td>${products[i].producto }</td>
      <td>${products[i].talla }</td>
      <td>${products[i].precio}</td>
      <td><a onClick="deleteItem(${i})" href="#"><i class='bx bx-trash'></i></a></td>
    </tr>`;
  }

  document.getElementById('total').innerHTML = total
  document.getElementById('items-body').innerHTML = tbody
}

function deleteItem(index) {
  let products = JSON.parse(localStorage.getItem('products'));
  products = products.filter(function(item, key) {
    return key !== index
  })
  localStorage.setItem('products', JSON.stringify(products))
  renderItems()
}

function resetStorage() {
  localStorage.clear()
}

renderItems()