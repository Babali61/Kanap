
//  Création de la variable basket qui prend pour valeur le getItem pour récuperer les données du localstorage 

let basket = JSON.parse(localStorage.getItem('basket')) || [];
console.log(basket)

// Fonction fetch get qui prend en objet cartItem dans l'url
async function getProduct(cartItem) {

  const response = await fetch(`http://localhost:3000/api/products/${cartItem}`);
  return await response.json();

}



//  Fonction pour sauvegarder le localstorage ( Création d'un tableau modifier avec id color et quantity ) et calcul du prix et de la quantité
function saveBasket() {

  localStorage.setItem("basket", JSON.stringify(basket.map(item => {
    return {
      id: item.id,
      color: item.color,
      quantity: item.quantity,
    };
  })));
  getTotalQuantity();
  getTotalPrice();
}

// Fonction pour mettre à jour la quantité en prenant en argument cartItem et la quantité 
function updateQuantity(cartItem, quantity) {
  // attribut de donnée quantité = quantité (la nouvelle quantité)
  cartItem.quantity = quantity
  saveBasket()


}

// Fonction qui supprime un item du localstorage et qui sauvegarde le localstorage (calcul du prix et de la quantité)
function removeItemFromBasket(cartItem) {
  // Recherche de l'element avec son index qui correspond à l'id et la couleur
  let index = basket.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  // Suppression de l'élement indexé
  basket.splice(index, 1);
  // Appel de la fonction sauvegarde panier
  saveBasket();

}

// Fonction qui permet de calculer la quantité avec la méthode reduce et qui affiche le prix

function getTotalQuantity() {
  // Version courte
  let totalQuantity = basket.reduce((total, cartItem) => total + cartItem.quantity, 0);

  document.getElementById('totalQuantity').innerHTML = `${totalQuantity}`;
}

// Fonction qui permet de calculer le prix avec la méthode reduce et qui affiche le prix

function getTotalPrice() {
  // Version courte
  let totalPrice = basket.reduce((total, item) => total + (item.quantity * item.price), 0)


  document.getElementById('totalPrice').innerHTML = `${totalPrice}`;
}


// Fonction anonyme immédiatement exécutée qui créer des élements html pour chaque item du panier (calcul du prix et de la quantité en plus)
(async () => {

  const itemsDiv = document.querySelector('#cart__items')

  // Promise.all pour exécuter de manière asynchrone une série de promesses. Chaque promesse appelle la fonction getProduct avec l'ID d'un élément du panier, 
  // et attend la résolution de cette promesse avant de continuer. Lorsque toutes les promesses ont été résolues, la fonction fléchée renvoie un tableau contenant les résultats de chaque promesse.
  basket = await Promise.all(basket.map(async (cartItem) => {
    // fusion de l'objet cartItem avec les propriétés de l'objet renvoyé par getProduct.
    return { ...cartItem, ...await getProduct(cartItem.id) }
  }));

  basket.forEach(cartItem => {

    // Création de l'élément article pour chaque item
    const article = document.createElement('article')
    article.className = 'cart__item'
    article.dataset.id = cartItem.id
    article.dataset.color = cartItem.color

    // Création de la div qui contiendra l'image
    const imgDiv = document.createElement('div')
    imgDiv.className = 'cart__item__img'

    // Création de l'image
    const img = document.createElement('img')
    img.src = cartItem.imageUrl
    img.alt = cartItem.altTxt

    // Ajout de l'image à la div
    imgDiv.appendChild(img)

    // Création de la div qui contiendra le contenu de l'item
    const contentDiv = document.createElement('div')
    contentDiv.className = 'cart__item__content'

    // Création de la div qui contiendra la description de l'item
    const descriptionDiv = document.createElement('div')
    descriptionDiv.className = 'cart__item__content__description'

    // Création du titre de l'item
    const name = document.createElement('h2')
    name.textContent = cartItem.name
    descriptionDiv.appendChild(name)

    // Création du paragraphe qui affichera la couleur de l'item
    const color = document.createElement('p')
    color.textContent = cartItem.color
    descriptionDiv.appendChild(color)

    // Création du paragraphe qui affichera le prix de l'item
    const price = document.createElement('p')
    price.textContent = `${cartItem.price} €`
    descriptionDiv.appendChild(price)

    // Ajout de la description à la div du contenu
    contentDiv.appendChild(descriptionDiv)

    // Création de la div qui contiendra les paramètres de l'item
    const settingsDiv = document.createElement('div')
    settingsDiv.className = 'cart__item__content__settings'

    // Création de la div qui contiendra le formulaire de changement de quantité
    const quantityDiv = document.createElement('div')
    quantityDiv.className = 'cart__item__content__settings__quantity'

    // Création du label pour le formulaire de quantité
    const quantityLabel = document.createElement('p')
    quantityLabel.textContent = 'Qté :'
    quantityDiv.appendChild(quantityLabel)

    // Création du formulaire de quantité
    const quantityInput = document.createElement('input')
    quantityInput.type = 'number'
    quantityInput.value = cartItem.quantity
    quantityInput.min = 1
    quantityInput.max = 100
    quantityInput.className = "itemQuantity"
    quantityDiv.appendChild(quantityInput)

    // Ajout d'un écouteur d'évènement sur le formulaire de quantité pour chaque item
    quantityInput.addEventListener('input', () => {
      updateQuantity(cartItem, parseInt(quantityInput.value));
    });

    // Ajout d'un data attribute à chaque formulaire de quantité pour stocker l'ID de l'item
    quantityInput.dataset.itemId = cartItem.id;

    // Ajout du data attribute qui stocke la couleur de l'item
    quantityInput.dataset.itemColor = cartItem.color;

    quantityInput.dataset.quantity = cartItem.quantity;
    quantityInput.dataset.price = cartItem.price;

    // Création de la div qui contiendra le bouton de suppression
    const deleteDiv = document.createElement('button')
    deleteDiv.className = 'cart__item__content__settings__delete'

    // Création du bouton de suppression
    const deleteButton = document.createElement('p')
    deleteButton.textContent = 'Supprimer'
    deleteDiv.appendChild(deleteButton)

    // Ajout d'un écouteur d'évènement sur le boutton de suppression pour chaque item + suppression de l'élément DOM
    deleteButton.addEventListener('click', () => {
      removeItemFromBasket(cartItem);
      article.remove()
    });

    // Ajout du formulaire de quantité et du bouton de suppression à la div des paramètres
    settingsDiv.appendChild(quantityDiv)
    settingsDiv.appendChild(deleteDiv)

    // Ajout des paramètres à la div du contenu
    contentDiv.appendChild(settingsDiv)

    // Ajout de l'image et du contenu à l'article
    article.appendChild(imgDiv)
    article.appendChild(contentDiv)

    // Ajout de l'article à la page
    itemsDiv.appendChild(article)
  });

  getTotalQuantity();
  getTotalPrice();
})();


// Fonction pour valider et commander le panier en remplissant le formulaire (test du formulaire) et création de l'objet formData
function validForm() {
  // récupération des données du formulaire
  const prenom = document.getElementById("firstName").value;
  const nom = document.getElementById("lastName").value;
  const adresse = document.getElementById("address").value;
  const ville = document.getElementById("city").value;
  const email = document.getElementById("email").value;
  
  let valid = true;

  // vérification de la validité des données
  if (prenom.trim() === "") {
    document.getElementById("firstNameErrorMsg").innerHTML = 'Veuillez rentrer un prenom dans le champ';
    valid = false;
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = ''
  }

  if (/[^a-zA-Zàâäéèêëïîôöùûüç-]/.test(prenom)) {
    document.getElementById("firstNameErrorMsg").innerHTML = 'Veuillez entrer un prénom sans nombres et sans caractères spéciaux'
    valid = false;
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = ''
  }

  if (nom.trim() === "") {
    document.getElementById("lastNameErrorMsg").innerHTML = 'Veuillez entrer un nom'
    valid = false;
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = ''
  }

  if (/[^a-zA-Zàâäéèêëïîôöùûüç-]/.test(nom)) {
    document.getElementById("lastNameErrorMsg").innerHTML = 'Veuillez entrer un nom sans nombres et sans caractères spéciaux'
    valid = false;
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = ''
  }

  if (adresse.trim() === "") {
    document.getElementById("addressErrorMsg").innerHTML = 'Veuillez entrer une adresse'
    valid = false;
  } else {
    document.getElementById("addressErrorMsg").innerHTML = ''
  }

  if (!(/^[0-9]+\s+[a-zA-ZÀ-ÿ\s-]+$/.test(adresse))) {
    document.getElementById("addressErrorMsg").innerHTML = "Veuillez entrer une adresse avec un numéro de rue et le reste de l'adresse sans caractères spéciaux"
    valid = false;
  } 

  else {
    document.getElementById("addressErrorMsg").innerHTML = ''
  }


  if (ville.trim() === "") {
    document.getElementById("cityErrorMsg").innerHTML = "Veuillez entrer une ville"
    valid = false;
  } else {
    document.getElementById("cityErrorMsg").innerHTML = ''
  }

  if (/[^a-zA-Zàâäéèêëïîôöùûüç-]/.test(ville)) {
    document.getElementById("cityErrorMsg").innerHTML = "Veuillez entrer une ville sans nombres et sans caractères spéciaux"
    valid = false;
  } else {
    document.getElementById("cityErrorMsg").innerHTML = ''
  }

  if (email.trim() === "") {
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez entrer un email"
    valid = false;
  } else {
    document.getElementById("emailErrorMsg").innerHTML = ''
  }


  if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) {
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez entrer un email avec un @ et un nom de domaine"
    valid = false;
  } else {
    document.getElementById("emailErrorMsg").innerHTML = ''
  }
  
  return valid;
}

function submitOrderForm() {
  // récupération des données du formulaire
  const prenom = document.getElementById("firstName").value;
  const nom = document.getElementById("lastName").value;
  const adresse = document.getElementById("address").value;
  const ville = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  // récupération des données des produits dans le panier
  const produits = [];
  // itération sur chaque produit dans le panier
  for (let produit of document.getElementsByClassName("cart__item")) {
    // récupération des données du produit
    let id = produit.dataset.id;

    // ajout du produit au tableau
    produits.push(id);
  }
  
  // création d'un objet contenant les données du formulaire
  let formData = {
    contact: {
      firstName: prenom,
      lastName: nom,
      address: adresse,
      city: ville,
      email: email,
    },
    products: produits
  };

  // Vérifie que les champs obligatoires ont été remplis
  if (validForm()) {
    sendOrderToAPI(formData)
  }
}



// Fonction qui envoie les données de la commande à l'API + redirection vers la page de confirmation de commande
function sendOrderToAPI(formData) {

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    },
  })

    .then((response) => response.json())


    .then((data) => {
      console.log(data)
      window.location.href = `confirmation.html?orderId=${data.orderId}`;
    })

}


// Associe la fonction submitOrderForm à l'événement "submit" du formulaire
const orderForm = document.querySelector('.cart__order__form');
orderForm.addEventListener('submit', event => {
  event.preventDefault(); // Empêche l'envoi du formulaire par défaut
  submitOrderForm();
  localStorage.clear();
});



