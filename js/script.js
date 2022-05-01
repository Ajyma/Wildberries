const $container = document.querySelector('.row');
const $category = document.querySelector('.categories_list');
const $create = document.querySelector('.create');
const $signOut = document.querySelector('.signOut');

const BASE_URL = 'https://pbasics.pythonanywhere.com'
const authToken = localStorage.getItem('authToken')

window.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    window.open('../auth.html', '_self')
  }
})

window.addEventListener('DOMContentLoaded', () => {
  getCategory()
  getProducts()
})

const requests = {
  get:(url) => {
    return fetch(url, {
      method:'GET',
      headers:{
        'Content-type':'application/json',
      }
    })
    .then(res => res.json())
  },
  post:(url, body) => {
    return fetch(url , {
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(body)
    })
    .then(res => res.json())
  },
  delete:(url) => {
    return fetch(url, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'Authorization': `Token ${authToken}`
      }
    })
  }
}
function getProducts() {
  fetch(`${BASE_URL}/products`)
  .then(res => res.json())
  .then(res => cardTemplate(res))
}

function cardTemplate(base) {
  const template = base.map(({id,title, description, price, image_url}) => {
    return `
      <div class="card">
        <div class="card-header">
          <img src="${image_url}">
        </div>
        <div class="card-body">
          <h2>${price} $</h3>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
        <div class="card-buttons">
          <button onclick="deleteProduct('${id}')">Delete</button>
        </div>
      </div>
    `
  }).reverse().join('')
  $container.innerHTML = template
}

function getCategory() {
  requests.get(`${BASE_URL}/category`)
  .then(r => {
    $category.innerHTML = r.map(r => categoryTemplate(r)).join('')
  })
}
function categoryTemplate({title, id}) {
  return `
    <div class="list">
      <button onclick="category('${id}')">${title}</button>
    </div>
  `
}
function category(id) {
  console.log(id);
  requests.get(`${BASE_URL}/products`)
  .then(r => {
    let filtered = r.filter(item => item.category == id)
    $container.innerHTML = filtered.map(res => cardTemplate(res))
  })
}
function deleteProduct(id) {
  requests.delete(`${BASE_URL}/products/delete/${id}`)
  .then(getProducts)
}

$create.addEventListener('click', e => {
  e.preventDefault()
  fetch(`${BASE_URL}/products/create/`, {
    method:"POST",
    headers:{
      'Content-type': 'application/json',
      'Authorization': `Token ${authToken}`
    },
    body:JSON.stringify({
      title: prompt('Title'),
      description: prompt('Description'),
      price: +prompt('Price'),
      image_url:prompt('Image'),
      category: +prompt('Category'),
    }),
  })
  .then(res => res.json())
  .then(getProducts)
})

$signOut.addEventListener('click', e => {
  e.preventDefault()

  requests.post(`${BASE_URL}/auth/token/logout`)
  .then(res => {
    localStorage.clear()
    window.open('../auth.html', '_self')
  })
})