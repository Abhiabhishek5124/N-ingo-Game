
// sign up

const form =  document.getElementById('signup-form');
form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const firstname = form.firstName.value;
    const lastname = form.lastName.value;
    const age = form.age.value;
    const email = form.email.value;
    const password = form.password.value;
    const phone = form.phone.value;

    const data = {
        firstname: firstname,
        lastname: lastname,
        age: age,
        email: email,
        password: password,
        phone: phone
    };

    axios.post('/api/auth/signup', data)
    .then(response => {
        alert(response.data.message);
        form.reset();
    })
    .catch(error => {
        console.log(error);
        alert('Failed to signup');
    });

}) ;



//login
window.onload = function() {
const loginForm =  document.getElementById('login-form');
loginForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const data = {
        email: email,
        password: password
    };

    axios.post('/api/auth/login', data)
    .then(response => {
        alert(response.data.message);
        loginForm.reset();
    })
    .catch(error => {
        console.log(error);
        alert('Failed to login');
    });

})
 } ;
