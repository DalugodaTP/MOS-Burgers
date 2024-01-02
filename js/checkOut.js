


//--------------------Control product display--------------------------


//--get the listProduct from HTML
let listcartHTML = document.querySelector('.listCart');

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

function updateCartCount(){
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(list => {
            totalQuantity = totalQuantity + list.quantity;
        })
    }
    //update the iconCartSpan class from this function
    iconCartSpan.innerHTML = totalQuantity;

}


function addCartToHTML(){
    listcartHTML.innerHTML = '';
    //to update the span
    
    
    if (carts.length>0) {
        carts.forEach(list =>{
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
            <div class="image">
                <img src="${info.image}" alt="">
            </div>
            <div class="name">
                ${info.name}  
            </div>
            <div class="itemCode">
                ${info.id}  
            </div>
            <div class="totalPrice">
                Rs.${total}
            </div>
            <div class="quantity">
                <span class="minus">-</span>
                <span>${list.quantity}</span>
                <span class="plus">+</span>
            </div>`;

            //--insert the carrier into the container
            listcartHTML.appendChild(newCart);
        })
    }
}



//to order to remove items, catch the event when user clicks on the cart
listcartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})

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
    
}

const updateView = () => {
    //capture two outputs
    // let grossAmount = document.getElementById('val_1');
    // let discVal = document.getElementById('val_2');
    // let total = document.getElementById('val_3');

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
            totalQuantity +=cart.quantity;

            //calculate the discount
            totalDiscount += cart.quantity * info.price * (info.discount / 100);
        })
    } else {
        grossAmount.innerHTML = 0;
        discVal.innerHTML = 0;
    }
    // grossAmount.innerHTML = 'Rs. ' + totalAmount;
    // discVal.innerHTML = 'Rs. ' + totalDiscount;
    // total.innerHTML = 'Rs. ' + (totalAmount - totalDiscount);
    iconCartSpan.innerHTML = totalQuantity;
}

