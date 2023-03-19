// Fonction qui permet de récuperer l'id de l'url
function getOrderId() {
  const urlOrder = window.location.search;
  const searchParams = new URLSearchParams(urlOrder);
  return searchParams.get("orderId");
}

const orderId = getOrderId();
displayOrder(orderId)


// Fonction qui permet d'afficher l'id de la commande
function displayOrder(orderId) {
  document.getElementById('orderId').innerHTML = `${orderId}`;
}