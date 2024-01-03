


//--------------------Control product display--------------------------


//--get the listProduct from HTML
let cartItemBoxHTML = document.querySelector('.cartItemBox');

//--update the span tag with aech item
let iconCartSpan = document.querySelector('.icon-cart span');

//--to Store the product value
let listProducts = [];
//--to Store the cart value
let carts = [];

//--dashboard values
let grossVal;
let discountVal;
let iconAmount;


//it will proceed to run initApp function - fetch data from localStorage and store in the array
const initApp = () => {
    if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        //--update icon
        updateCartCount();
    }

    fetch('json/products.json') //this is return a promise
        .then(response => response.json()) //convert that promise inside that promise into a jason file
        .then(data => {
            //load the data into the array
            listProducts = data;
            addCartToHTML();
        })

    //--update the final view

}



initApp();

const addCartToMemory = () => {
    //convert the array to json to save
    localStorage.setItem('cart', JSON.stringify(carts));
}

function updateCartCount() {
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(list => {
            totalQuantity = totalQuantity + list.quantity;
        })
    }
    //update the iconCartSpan class from this function
    iconCartSpan.innerHTML = totalQuantity;
}


function addCartToHTML() {
    cartItemBoxHTML.innerHTML = '';
    //to update the span
    if (carts.length > 0) {
        carts.forEach(list => {
            //--create a div for each item (carrier)
            let newCart = document.createElement('div');
            //--set the item class into this carrier
            newCart.classList.add('item');

            //for minus and plus
            newCart.dataset.id = list.product_id;

            //--Fetch data from product list 
            let positionProduct = listProducts.findIndex((value) => value.id == list.product_id);
            let info = listProducts[positionProduct];

            let total = info.price * list.quantity;


            //--insert html
            newCart.innerHTML = `
            <div class="product-card">
                        <div class="card">
                            
                            <div class="img-box">
                                <img src="${info.image}" alt="" width="80px"
                                    class="product-img">
                            </div>

                            <div class="detail">
                                <h4 class="product-name">${info.name}</h4>${list.product_id}

                                <div class="wrapper">
                                    <div class="product-qty">
                                    <button class="minus" data-product-id="${list.product_id}">
                                        <ion-icon name="remove-outline"></ion-icon>
                                    </button>
                            
                                    <span class="quantity">${list.quantity}</span>
                            
                                    <button class="plus" data-product-id="${list.product_id}">
                                        <ion-icon name="add-outline"></ion-icon>
                                    </button>   
                                </div>

                                <div class="price">
                                    Rs. <span class="price">${total}</span>
                                </div>
                                </div>
                            </div>

                            <button class="product-close-btn" data-product-id="${list.product_id}">
                                <ion-icon name="close-circle-outline"></ion-icon>
                            </button>
                        </div>
                    </div>`;

            //--insert the carrier into the container
            cartItemBoxHTML.appendChild(newCart);
        })
    }
    updateView();
}

// Add or remove items from the cart

// Inside your initApp function or at the end of your script
document.addEventListener('click', (event) => {
    let targetElement = event.target;

    // Check if the clicked element has the class 'minus' or 'plus'
    if (targetElement.classList.contains('minus') || targetElement.classList.contains('plus')) {
        let product_id = targetElement.dataset.productId;

        if (product_id) {
            let type = targetElement.classList.contains('minus') ? 'minus' : 'plus';

            // Call the changeQuantity function with the product_id and type
            changeQuantity(product_id, type);
        }
    }
});


//change the quantity in the local memory
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1); //remove the item 
                    updateView();
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
    updateView();
}

//remove the item when cancel is clicked

// Inside your initApp function or at the end of your script
document.addEventListener('click', (event) => {
    let targetElement = event.target.parentElement;
    

    // Check if the clicked element has the class 'minus' or 'plus'
    if (targetElement.classList.contains('product-close-btn')) {
        let product_id = targetElement.dataset.productId;
        
        if (product_id) {
            // Call a function to handle the removal of the item with the given product_id
            removeItem(product_id);
        }
    }
});


// Add a new function to handle the removal of items
const removeItem = (product_id) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);

    if (positionItemInCart >= 0) {
        carts.splice(positionItemInCart, 1); // Remove the item
        addCartToHTML();
        addCartToMemory();
        updateView();
    }else{
        updateView();
    }
};

const updateView = () => {
    //capture two outputs
    let grossAmount = document.getElementById('subtotal');
    let taxVal = document.getElementById('tax');
    let shipppingVal = document.getElementById('shipping');
    let discVal = document.getElementById('discount');
    let total = document.getElementById('total');


    //get the sum of values from the array
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalDiscount = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            //calculate the gross amount
            totalAmount += cart.quantity * info.price;
            totalQuantity += cart.quantity;

            //calculate the discount
            totalDiscount += cart.quantity * info.price * (info.discount / 100);
            console.log(totalDiscount);
        })
    } else {
        iconCartSpan.innerHTML = totalQuantity;
        grossAmount.innerHTML = 0;
        discVal.innerHTML = 0;
        taxVal.innerHTML =0;

    }

    taxVal.innerHTML = (totalAmount*(18/100)).toLocaleString();
    grossAmount.innerHTML = (totalAmount).toLocaleString();
    discVal.innerHTML = (totalDiscount).toLocaleString();
    total.innerHTML = (totalAmount +totalAmount*(18/100)- totalDiscount).toLocaleString();
    iconCartSpan.innerHTML = totalQuantity;

    //update pay button
    let payBtn = document.getElementById('payAmout');

    payBtn.innerHTML = (totalAmount +totalAmount*(18/100)- totalDiscount).toLocaleString();
}

