const $form = document.querySelector('.form');
const $username = document.querySelector('.username');
const $email = document.querySelector('.email');
const $password = document.querySelector('.password');

const BASE_URL = 'https://pbasics.pythonanywhere.com'

$form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(`${BASE_URL}/auth/users/`, {
    method:'POST',
    body:JSON.stringify({
      username:$username.value,
      password:$password.value,
      email:$email.value
    }),
    headers: {
      'Content-type':'application/json'
    }
  })
  .then(r => {
    r.json()
    if (r.status !== 400 || r.status !== 401){
      window.open('../auth.html','_self')
    }
  })
  .then(res => {
    localStorage.setItem('authToken', res.auth_token)
  })
})