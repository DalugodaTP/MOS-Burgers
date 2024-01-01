var customerList;

//--------------------------Validation-------------------------------------

//save reference from each form item
const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {
    //prevent submitting in order to validate
    e.preventDefault();
    //validate all inputs
    validateInput();
    
    //--Default actions
    let userName = document.username.value.trim();
    let emailValue = email.value.trim();
    let passwordValue = password.value.trim();

    //store them into an object
    let customerData = {
        user_name: userName,
        emailAdd: emailValue,
        password: passwordValue
    };

    customerList = customerData;

    //store that object in an array
    addCustomerToMemory();


});

//validate all input fields
const validateInput = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    //--for username
    if (usernameValue === '') {
        setError(username, 'Username is required');
    } else {
        setSucess(username);
    }

    //--for email
    if (emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Email is required');
    } else {
        setSucess(email);
    }

    //--for password
    if (passwordValue === '') {
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 character.')
    } else {
        setSuccess(password);
    }

    //--seond password
    if (password2Value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }
};

const setError = (element, message) => {
    //parent element
    const inputControl = element.parentElement;
    //arrow display
    const errorDispay = inputControl.querySelector('.error');

    errorDispay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

const setSucess = element => {
    //parent element
    const inputControl = element.parentElement;
    //arrow display
    const errorDispay = inputControl.querySelector('.error');

    errorDispay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//--------------------------------------------------------------------------




// document.getElementById('btnSignUp').addEventListener('click', (event) => {

//     if (true) { //validate data
//         //capture the data from the fields
//         let firstName = document.getElementById('firstName').value;
//         let lastName = document.getElementById('lastName').value;
//         let email = document.getElementById('email').value;
//         let add = document.getElementById('address').value;
//         let passKey = document.getElementById('password').value;
//         let cardName = document.getElementById('cc-name').value;
//         let ccNum = document.getElementById('credit').value;
//         let expDate = document.getElementById('cc-expiration').value;
//         let cvvNum = document.getElementById('cc-cvv').value;

//         //store them into an object
//         let customerData = {
//             first_name: firstName,
//             last_name: lastName,
//             emailAdd: email,
//             address: add,
//             password: passKey,
//             Name_on_card: cardName,
//             cc_number: ccNum,
//             expirationDate: expDate,
//             cvv: cvvNum
//         };

//         // Add the data to the customerList array
//         //customerList.push(customerData);

//         customerList = customerData;

//         //store that object in an array
//         addCustomerToMemory();
//     }
// })

const addCustomerToMemory = () => {
    //if there is nothing saved at the start then save an empty array
    if (localStorage.getItem('customerDbList') == null) {
        localStorage.setItem('customerDbList', '[]');
    }
    //get the original array by converting string to array
    let old_data = JSON.parse(localStorage.getItem('customerDbList'));
    old_data.push(customerList);

    //save old data + new data to local storage
    localStorage.setItem('customerDbList', JSON.stringify(old_data));

    console.log(JSON.parse(localStorage.getItem('customerDbList')));
}

