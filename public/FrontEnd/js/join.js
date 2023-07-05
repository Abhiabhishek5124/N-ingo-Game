// Gets the form and when the form gets submitted we want to create a user. We have to make sure a user already does not exist.
const form = document.querySelector("form");
form.addEventListener("submit", function(event){
    // prevents the default form submission behaviour
    event.preventDefault();
    const last_name = form.elements.lastName.value;
    const first_name = form.elements.firstName.value;
    const age_input = form.elements.age.value;
    const email_input = form.elements.email.value;
    const passwordInput = form.elements.password.value;
    const phoneInput = form.elements.phone.value;
    // performing a post request
    axios.post('http://localhost:8000/BingoGame/users/signup', {
        firstName: firstName,
        lastName: last_name,
        age: age_input,
        email: email_input,
        password:passwordInput,
        phone: phoneInput
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
})