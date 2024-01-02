//-------------------Dynamic cart function-----------------------------

document.addEventListener('DOMContentLoaded', function () {
    // Your code here
    let iconCart = document.querySelector('.icon-cart');
    let closeCart = document.querySelector('.close');
    let cartTab = document.querySelector('.cartTab');

    iconCart.addEventListener('click', () => {
        cartTab.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        cartTab.classList.toggle('showCart');
    });
});

//--------------------Control product display--------------------------


//get the listProduct from HTML
let listProductHTML = document.querySelector('.listProduct');
//get the listCart from HTML
let listCartHTML = document.querySelector('.listCart');
//update the span tag with aech item
let iconCartSpan = document.querySelector('.icon-cart span');


//create an empty list product Array
let listProducts = [];
//to Store the cart value
let carts = [];

//---data---
let grossVal;
let discountVal;


//it will proceed to run initApp function - fetch data from the file
const initApp = () => {
    //get data from jason
    fetch('json/products.json') //this is return a promise
        .then(response => response.json()) //convert that promise inside that promise into a jason file
        .then(data => {
            //load the data into the array
            listProducts = data;
            //call a function to add data onto the screen
            addDataToHTML();

            //get cart from memory, if any memory exists
            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }

        })

}
initApp();


//insert the data into DOM

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            //create a component with a class item
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            //pass a dataSet which are the id (recorded in the item class)
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="discount">${product.discount}%</div>
            <div class="portion">${product.portion}</div>
            <div class="price">Rs.${product.price}</div>
            <button class="addCart">
                Add to Cart
            </button>`;

            //inject this new element into the list product class with appenChild
            listProductHTML.appendChild(newProduct);
        })
    }
}

//Add to cart when user clicks any item

listProductHTML.addEventListener('click', (event) => {
    //find the location where the user just clicked
    let positionClick = event.target;
    //if that location has addCart, then process it
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
        showToast(successMsg);
    }
})

//---Add to cart function

const addToCart = (product_id) => {
    //an index to find the position of it in the cart
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    //store the data to the local storage
    addCartToMemory();
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    //to update the span
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(list => {
            totalQuantity = totalQuantity + list.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');

            //for minus and plus
            newCart.dataset.id = list.product_id;

            //retrieve other information
            let positionProduct = listProducts.findIndex((value) => value.id == list.product_id);
            let info = listProducts[positionProduct];
            console.log(info);
            let total = info.price * list.quantity;

            newCart.innerHTML = `
            <div class="image">
                <img src="${info.image}" alt="">
            </div>
            <div class="name">
                ${info.name}  
            </div>
            <div class="totalPrice">
                Rs.${total}
            </div>
            <div class="quantity">
                <span class="minus">-</span>
                <span>${list.quantity}</span>
                <span class="plus">+</span>
            </div>`;
            //inject this new element into the list product class with appenChild
            listCartHTML.appendChild(newCart);
        })
        updateView();
    }
    //update the iconCartSpan class from this function
    iconCartSpan.innerText = totalQuantity;
}

const addCartToMemory = () => {
    //convert the array to json to save
    localStorage.setItem('cart', JSON.stringify(carts));
}

//to order to remove items, catch the event when user clicks on the cart
listCartHTML.addEventListener('click', (event) => {
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
                    if (carts.length == 0) {
                        document.querySelector('.cartTab').classList.toggle('showCart');
                    }
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const updateView = () => {
    //capture two outputs
    let grossAmount = document.getElementById('val_1');
    let discVal = document.getElementById('val_2');
    let total = document.getElementById('val_3');

    //get the sum of values from the array
    let totalAmount = 0;
    let totalDiscount = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            //calculate the gross amount
            totalAmount += cart.quantity * info.price;

            //calculate the discount
            totalDiscount += cart.quantity * info.price * (info.discount / 100);
        })
    } else {
        grossAmount.innerHTML = 0;
        discVal.innerHTML = 0;
    }
    grossAmount.innerHTML = 'Rs. ' + totalAmount;
    discVal.innerHTML = 'Rs. ' + totalDiscount;
    total.innerHTML = 'Rs. ' + (totalAmount - totalDiscount);
}


//sort items


document.addEventListener('click', (event) => {
    //find the location where the user just clicked
    let positionClick = event.target;

    //-For the buttons
    if (positionClick.value && positionClick.value.includes("burger")) {
        listProductHTML.innerHTML = '';
        let sortedList = listProducts.filter(item => item.name.includes('Burger'));
        addDataToHTMLCustom(sortedList);

    } else if (positionClick.value && positionClick.value.includes("chicken")) {
        listProductHTML.innerHTML = '';
        let sortedList = listProducts.filter(item => item.name.includes('Chicken'));
        addDataToHTMLCustom(sortedList);

    } else if (positionClick.value && positionClick.value.includes("pasta")) {
        listProductHTML.innerHTML = '';
        let sortedList = listProducts.filter(item => item.name.includes('Pasta'));
        addDataToHTMLCustom(sortedList);

    } else if (positionClick.value && positionClick.value.includes("Submarine")) {
        listProductHTML.innerHTML = '';
        let sortedList = listProducts.filter(item => item.name.includes('Submarine'));
        addDataToHTMLCustom(sortedList);

    } else if (positionClick.value && positionClick.value.includes("fries")) {
        listProductHTML.innerHTML = '';
        let sortedList = listProducts.filter(item => item.name.includes('Fries'));
        addDataToHTMLCustom(sortedList);
    }
})

document.getElementById('txtSearch').addEventListener("input", (event) => {
    listProductHTML.innerHTML = '';
    let sortedList = listProducts.filter(item => item.name.toLowerCase().includes(txtSearch.value.toLowerCase()));
    addDataToHTMLCustom(sortedList);
});


const addDataToHTMLCustom = (list) => {
    listProductHTML.innerHTML = '';
    if (list.length > 0) {
        list.forEach(product => {
            //create a component with a class item
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            //pass a dataSet which are the id (recorded in the item class)
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="discount">${product.discount}%</div>
            <div class="portion">${product.portion}</div>
            <div class="price">Rs.${product.price}</div>
            <button class="addCart">
                Add to Cart
            </button>`;

            //inject this new element into the list product class with appenChild
            listProductHTML.appendChild(newProduct);
        })
    }
}

//---Toasts--------------------------
let toastBox = document.getElementById('toastBox');
let successMsg = '<span class="material-symbols-outlined">check_circle</span> Added to cart';


function showToast(msg) {
    let toast = document.createElement('div'); //create one element of div
    toast.classList.add('toast');
    toast.innerHTML = msg;
    toastBox.appendChild(toast); //toast will be added into the div

    setTimeout(() =>{
        toast.remove();
    }, 2000);
}
