//  récupération et extraction de l'url

const queryStringUrlId = window.location.search;
const searchParams = new URLSearchParams(queryStringUrlId);
let leId = searchParams.get("id");



// Appel de l'api avec l'id correspondant au canapé

fetch(`http://localhost:3000/api/products/${leId}`)
.then ((response) => response.json())
.then ((posts) => {
  let output = "";
  output = `   
      <img src="${posts.imageUrl}" alt="${posts.altTxt}">
     `
  document.querySelector('.item__img').innerHTML = output;
  document.getElementById("title").textContent = posts.name
  document.getElementById("price").textContent = posts.price
  document.getElementById("description").textContent = posts.description

  outputcolors = `<option value="">--SVP, choisissez une couleur --</option> `
  for ( var i = 0; i<posts.colors.length; i++){
    
    outputcolors += `   
      <option value="${posts.colors[i]}">${posts.colors[i]}</option>
     `    
     document.getElementById("colors").innerHTML = outputcolors

    }

//  Ajout de la variable basket qui va initialiser le tableau dans le localstorage

    const basket = JSON.parse(localStorage.getItem('basket')) ?? []

    function addTobasket () {   

      // Condition du canapé sans couleur et quantité + Ajout du canapé 
      if (basket.find( e => e.color === "" || e.quantity === 0 )) {
        alert ('Veuillez ajouter une couleur et une quantité au canapé')
   
      }


      let color = document.getElementById("colors").value;
      
      let quantity = document.getElementById("quantity").value;

       

    
      let itemKanap = {
        id : posts._id,
  
        color : color,
  
        quantity : Number(quantity),
      }

  //  déclaration du produit qui a comme point commun l'id et la couleur

      let itemIdProduct = basket.find( p => p.id === posts._id && p.color === color);
  
      
      console.log (itemIdProduct)
      console.log (  posts._id)
      console.log ( color)
      quantity = parseInt(quantity)
      console.log ( typeof quantity)
      
  //  condition pour ajouter une quantité sur un produit déja existant
        if (itemIdProduct) {
      
          itemIdProduct.quantity += quantity

        }
        else {
        
          basket.push(itemKanap)

        }
      

    }

//  ajoute de la fonction pour ajouter le produit dans le local storage
    function savePanier (){
  
      localStorage.setItem("basket", JSON.stringify(basket))
  
    }
    
     
    //  Déclaration du bouton avec l'évenement on click
    
     const btnEnvoyerPanier = document.getElementById ("addToCart");
     btnEnvoyerPanier.addEventListener("click", (event)=> {

      event.preventDefault();  

      
     
      addTobasket ();
      savePanier();
    

  })

})

