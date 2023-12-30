var customerList;


document.getElementById('btnSignUp').addEventListener('click', (event) => {
    
    if (true) { //validate data
        //capture the data from the fields
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let email = document.getElementById('email').value;
        let add = document.getElementById('address').value;
        let passKey = document.getElementById('password').value;
        let cardName = document.getElementById('cc-name').value;
        let ccNum = document.getElementById('credit').value;
        let expDate = document.getElementById('cc-expiration').value;
        let cvvNum = document.getElementById('cc-cvv').value;

        //store them into an object
        let customerData = {
            first_name: firstName,
            last_name: lastName,
            emailAdd: email,
            address: add,
            password: passKey,
            Name_on_card: cardName,
            cc_number: ccNum,
            expirationDate: expDate,
            cvv: cvvNum
        };

        // Add the data to the customerList array
        //customerList.push(customerData);

        customerList = customerData;

        //store that object in an array
        addCustomerToMemory();
    }
})



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



//---Payment details---

// Add event listener to each radio button
document.getElementsByName('paymentMethod').forEach(function (radio) {
    let nameLbl = document.getElementById('cardType');
    radio.addEventListener('change', function () {
        // Check which radio button is selected
        if (radio.checked) {
            switch (radio.id) {
                case "credit": {
                    nameLbl.innerHTML = `
                <label for="cc-number" class="form-label">Credit card number</label>
                <input type="text" class="form-control" id="cc-number-credit" placeholder="" required="">`;
                }; break;
                case "debit": {
                    nameLbl.innerHTML = `
                <label for="cc-number" class="form-label">Debit card number</label>
                <input type="text" class="form-control" id="cc-number-debit" placeholder="" required="">`;
                }; break;
            }
        }
    });
});