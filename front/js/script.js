// Appel de l'api avec fetch puis promesse JSON puis fonction post intégrant un output de valeur null avec une autre fonction forEach ( post ) qui parcours les élements du tableau 
// et qui affiche les éléments du tableau en appelant les valeurs de JSON avec ${nomFonction.nomTableau}. 
// Enfin, la correspondance est effectuée en utilisant document.querySelector en appelant l'id #items qui est parent du lien et de l'article du canapé.

window.onload = function () {
  fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((posts) => {
      let output = "";
      posts.forEach(function (post) {
        output += `   
          <a href="./product.html?id=${post._id}">
            <article>
               <img id="imgProduct" src="${post.imageUrl}" alt="${post.altTxt}">
              <h3 class="productName" id="nameProduct">${post.name}</h3>
              <p class="productDescription" id="description">${post.description}</p>
            </article>
          </a>
           `
      });
      document.querySelector('#items').innerHTML = output;
    });
};