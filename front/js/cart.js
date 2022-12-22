
//  Création de la variable basket qui prend pour valeur le getItem pour récuperer les données du localstorage 
 
 let basket = JSON.parse(localStorage.getItem('basket'))||[];
console.log (basket)


async function getProduct(cartItem) {
  console.log(cartItem)
  const response = await fetch(`http://localhost:3000/api/products/${cartItem}` );
  return await response.json();
  
}

(async () => {
  
  const basket = JSON.parse(localStorage.getItem('basket')) ?? [];
  
  const items = [];
  for (const cartItem of basket) {
    const product = {...cartItem, ...await getProduct(cartItem.id)};
    items.push(product);
  }
  
  // CREATION DU DOM
  let html = '';
  for (const item of items) {
    html += `   
        <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
          <div class="cart__item__img">
            <img src="${item.imageUrl}" alt="${item.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${item.name}</h2>
              <p>${item.color}</p>
              <p>${item.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : ${item.quantity} </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="1">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
        `;
  }
  document.getElementById("cart__items").innerHTML = html;
  
  
  function getTotalQuantity() {
    // Version courte
    let totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
        
    // Version longue
    // let total = 0;
    
    // basket.forEach((cartItem) => {
    //   totalQuantity = total + cartItem.quantity;
    // })
    
    // return total
    document.getElementById('totalQuantity').innerHTML = `${totalQuantity}`;
  }
  getTotalQuantity();

  function getTotalPrice() {
    // Version courte
    let totalPrice = items.reduce((total, item) => total + (item.quantity * item.price), 0)

    // console.log(TotalPrice.price)
    
    // Version longue
    // let total = 0;
    
    // basket.forEach( async (cartItem) => {
    //   cartItem = {...cartItem, ... await getProduct(cartItem.id)};
    //   totalPrice = total + (cartItem.quantity * cartItem.price);
    //   console.log(cartItem.price)
    // })
    
    document.getElementById('totalPrice').innerHTML = `${totalPrice}`;
  }
  getTotalPrice();
  
  
  
})()




function removeProductFromBasket() {
  const deleteItem = document.querySelectorAll(".deleteItem");
  console.log(deleteItem)
  
      for (let e = 0 ; e<deleteItem.length; e++ ) {
          deleteItem[e].addEventListener("click", (event) => {
            event.preventDefault();
            let idInLocalStorage = basket[e].id;
            let colorInLocalStorage = basket[e].color;
            console.log(colorInLocalStorage)
            let valuesArrFromObjet = Object.values(basket);
            basket = valuesArrFromObjet.filter ( item => item.id !== idInLocalStorage && item.color !== colorInLocalStorage);

            console.log(basket);
            savePanier();

            
          })
      }
}


//  Fonction pour sauvegarder le localstorage ( fonction appeler dans la fonction pour supprimer un produit )
function savePanier (){
  
  localStorage.setItem("basket", JSON.stringify(basket))

}


// Fonction pour le formulaire 

function validerPanier() {
  const submitCart = document.querySelector("order");
  // Récupération des données du formulaire

  submitCart.addEventListener("click", (event) => {
    event.preventDefault();
    var prenom = document.getElementById("firstName").value;
    var nom = document.getElementById("lastName").value;
    var adresse = document.getElementById("adress").value;
    let ville = document.getElementById("city").value;
    var email = document.getElementById("email").value;
  
    // Vérification de la validité des données
    if (prenom.trim() === "" || nom.trim() === "" || adresse.trim() === ""|| ville.trim() === ""|| email.trim() === "") {
      alert("Veuillez remplir tous les champs du formulaire");
    }
  })
  
}
