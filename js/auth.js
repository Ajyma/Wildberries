const $form = document.querySelector('.form');
const $username = document.querySelector('.username');
const $password = document.querySelector('.password');

const BASE_URL = 'https://pbasics.pythonanywhere.com'

$form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(`${BASE_URL}/auth/token/login`, {
    method:'POST',
    body:JSON.stringify({
      username:$username.value.trim(),
      password:$password.value.trim(),
    }),
    headers: {
      'Content-type':'application/json'
    }
  })
  .then(r => r.json())
  .then(res => {
    console.log(res);
    localStorage.setItem('authToken', res.auth_token)
    if (res.auth_token) {
      window.open('../index.html', '_self')
    } else {
      window.open('../auth.html', '_self')
    }
  })
})