
//moving the border of the about section
const border = document.querySelector('.sweet-border');
const sweet = document.querySelector('.sweet');

sweet.addEventListener('mouseover', moveBorder);
sweet.addEventListener('mouseout', returnBorder);

function moveBorder(){
    border.animate([{ transform: 'translate(0px, 0px)' }, { transform: 'translate(32px, 21px)' }],{duration:700 ,fill:'forwards'} );
}

function returnBorder(){
    border.animate([{ transform: 'translate(32px, 21px)' },{ transform: 'translate(0px, 0px)' }], { duration: 700, fill: 'forwards' });
};



//moving to store section by clicking explore btn
//const exploreBtn = document.querySelector('.explore');
//exploreBtn.addEventListener('click', function(){   
//});


////////////////////////////////////////////////////////////////////////////

const storeManager = document.querySelector('.store_manager');
const allBtn = document.querySelector('.all');
const cakesBtn = document.querySelector('.cakes');
const cupcakesBtn = document.querySelector('.cupcakes');
const sweetsBtn = document.querySelector('.sweets');
const doughnutsBtn = document.querySelector('.doughnuts');
const itemsList = document.querySelector('.items_list');
const searchBar = document.querySelector('.search_bar');
const searchBtn = document.querySelector('.search');
const gallery = document.querySelector('.gallery');
const galleryImage = document.querySelector('.gallery_image');
const closeBtn = document.querySelector('.js__close');
const cartItems = document.querySelector('.cart-items');
const cartBtn = document.querySelector('.cart');
const closeCartBtn = document.querySelector('.close');

const cartTotal = document.querySelector('.cart-total');
const cartTotalBtn = document.querySelector('.cart-total-btn');
const cartOverlay = document.querySelector('.cart_overlay');
const cartHolder = document.querySelector('.cart_holder');
const cartContent = document.querySelector('.cart_content');
const clearCartartBtn = document.querySelector('.clear-cart');



//cart
let cart = [];
let buttonsDOM = [];

//////////////////////////getting the sweets//////////////////////////////
class Sweets {
    async getSweets() {
        try {
            let result = await fetch("products.json");
            let data = await result.json(); 
            let sweets = data.items;
            sweets = sweets.map((item) => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                const {product} = item.fields;

                return { title, price, id, image,product };
            });

            return sweets;
        } catch (error) {
            console.log(error);
        }
    }
}

/////////////////////////////////display sweets////////////////////////////////
class UI {
    displaySweets(sweets) {
        let result = "";
        sweets.forEach(sweet => {
            result += `
            <div class="item">
                <figure class="item_photo">
                  <img src=${sweet.image} alt=${sweet.title} class="photo">
                  <button class="item_cart" data-id=${sweet.id}>Add to Cart</button>
                </figure>
                <div class="item_text">
                  <p>${sweet.title}</p>
                  <p>$${sweet.price}</p>
                </div>
              </div>`;
        });
        itemsList.innerHTML = result;

        //display gallery by clicking on the image
        itemsList.addEventListener('click', event => {
            if (event.target.matches('.photo')) {
                let photo = event.target;
                gallery.style.visibility = 'visible';
                galleryImage.src = photo.src;
            }
        })
        //closing the gallery
        closeBtn.addEventListener('click', function () {
            gallery.style.visibility = 'hidden';
        });
        
    }

    displayCakes(sweets){
        let cakes = sweets.filter(el => el.product === 'cake');
        this.displaySweets(cakes);
    }

    displayCupCakes(sweets) {
        let cupcakes = sweets.filter(el => el.product === 'cupcake');
        this.displaySweets(cupcakes);
    }

    displayDoughnuts(sweets) {
        let doughnuts = sweets.filter(el => el.product === 'doughnut');
        this.displaySweets(doughnuts);
    }

    displaySweetItems(sweets) {
        let sweetItem = sweets.filter(el => el.product === 'sweet');
        this.displaySweets(sweetItem);
    }

    displaySearchRes(sweets){
        let search = sweets.filter(el => el.title.toLowerCase() === searchBar.value);
        this.displaySweets(search);
    }

    ////------------set up add to cart buttons---------------------////

    getBagBtns(){
       itemsList.addEventListener('click', event =>{

           if (event.target.matches('.item_cart')){
              let button = event.target;
              let id = button.dataset.id;
              let inCart  = cart.find(el => (el.id === id));

              if(inCart){
                  button.disabled = true;
                  button.innerText = 'In Cart';
              }
              button.disabled = true;
              button.innerText = 'In Cart';

              let cartItem = {...Storage.getSweet(id) , amount: 1};
              cart = [...cart, cartItem];

              Storage.saveCart(cart);

              this.setCartValues(cart);

              this.addCartItem(cartItem);

              this.showCart();
           }
    
       })
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemTotal = 0;

        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemTotal += item.amount;
        });
        cartTotal.innerText = tempTotal;
        cartTotalBtn.innerText = tempTotal;
        cartItems.innerText = itemTotal;
        
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML =
    `
    <img src=${item.image} alt="sweet" class="cart_image">
              <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
              </div>
              <div class="controllers">
                <div>
                  <i class="fas fa-chevron-left" data-id=${item.id}></i>
                  <p class="item-amount">${item.amount}</p>
                  <i class="fas fa-chevron-right" data-id=${item.id}></i>
                </div>
                <span class="remove-item"><i class="fas fa-trash" data-id=${item.id}></i></span>
              </div>
    `;

        cartContent.appendChild(div);
        
    }

    showCart() {
        cartHolder.classList.add('showCart');
        cartOverlay.classList.add('transparentBcg');
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart() {
        cartHolder.classList.remove('showCart');
        cartOverlay.classList.remove('transparentBcg');
    }

    //-------------------------------//

    cartLogic() {

        //clear cart button
        clearCartartBtn.addEventListener('click', () => {      
            this.clearCart();
        });
        //cart functionality
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                //remove item from DOM
                cartContent.removeChild(removeItem.parentElement.parentElement);
                //remove item from the storage
                this.removeItem(id);

            } else if (event.target.classList.contains('fa-chevron-right')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                //update the amount in the storage
                tempItem.amount = tempItem.amount + 1;
                //save the item in the cart
                Storage.saveCart(cart);
                //update the price values in the cart
                this.setCartValues(cart);
                //update the amount in the DOM
                addAmount.previousElementSibling.innerText = tempItem.amount;

            } else if (event.target.classList.contains('fa-chevron-left')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                //update the amount in the storage
                tempItem.amount = tempItem.amount - 1;

                if (tempItem.amount > 0) {
                    //save the item in the cart
                    Storage.saveCart(cart);
                    //update the price values in the cart
                    this.setCartValues(cart);
                    //update the amount in the DOM
                    lowerAmount.nextElementSibling.innerText = tempItem.amount;
                } else {
                    //remove item from DOM
                    cartContent.removeChild(lowerAmount.parentElement.parentElement.parentElement);
                    //remove item from the storage
                    this.removeItem(id);
                }

            }
        });
    }

    clearCart() {
        let cartItems = cart.map(item => item.id);
        //console.log(cartItems);
        cartItems.forEach(id => this.removeItem(id));

        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }

        this.hideCart();
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleBtn(id);
        button.disabled = false;
        button.innerHTML = 'Add to Cart';
    }

    getSingleBtn(id) {
        buttonsDOM = [...document.querySelectorAll('.item_cart')];
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}




//////////////////local storage///////////////////////////////////////
class Storage {
    static saveSweets(sweets) {
        localStorage.setItem("sweets", JSON.stringify(sweets)); 
    }

    static getSweet(id) {
        let sweets = JSON.parse(localStorage.getItem("sweets"));
        return sweets.find((sweet) => sweet.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}


//////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const sweets = new Sweets();
    //setup app
    ui.setupAPP();

    //getting the products
    sweets
        .getSweets()
        .then((sweets) => {

            //clicking buttons
            allBtn.addEventListener('click', function () {
                ui.displaySweets(sweets);
            });
            cakesBtn.addEventListener('click', function(){
                ui.displayCakes(sweets);
            });
            cupcakesBtn.addEventListener('click', function(){
                ui.displayCupCakes(sweets);
            });
            doughnutsBtn.addEventListener('click', function(){
                ui.displayDoughnuts(sweets);
            });
            sweetsBtn.addEventListener('click', function(){
                ui.displaySweetItems(sweets);
            });

            //search btn
           searchBtn.addEventListener('click', function(){
               ui.displaySearchRes(sweets);
                searchBar.value = '';
           });

           document.addEventListener('keypress', function(event){
                if(event.keyCode ===13 || event.which ===13){
                    ui.displaySearchRes(sweets);
                    searchBar.value = '';
                }
           })

            //because it is a static method, we dont need to create an instant for it first.
            Storage.saveSweets(sweets);
        })
       .then(() => {
          ui.getBagBtns();
            ui.cartLogic();
      });
      
});



/*
 window.addEventListener('load', function () {
        cart.forEach(item => {
            itemsList.children.forEach(el => {
                if (el.id === item.id) {
                    let button = document.querySelector('.item_cart');
                    button.disabled = true;
                    button.textContent = 'In Cart';
                }
            })
        })
    });
*/