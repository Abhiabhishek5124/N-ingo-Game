let hostFrom = document.getElementById("#hostGame")
// get the query string from the current URL
const queryString = window.location.search;

// create a URLSearchParams object from the query string
const urlParams = new URLSearchParams(queryString);

// extract the username parameter from the URL
const username = urlParams.get('username');

// use the username value in your JavaScript code
console.log('The username is:', username);
