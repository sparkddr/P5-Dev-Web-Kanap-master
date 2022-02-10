
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    const api = value;
    let panier = getBasket();
    //Affichage du panier
    cartDisplay(api, panier);
    //Ajout de la quantité et du prix dans le DOM
    document.querySelector("#totalQuantity").innerHTML = getTotalQuantity(panier);;
    document.querySelector("#totalPrice").innerHTML = getTotalPrice(panier,api);
  })
  .catch(function (err) {
    //Une erreur est survenue
  });

//Fonction pour récupérer le panier en tableau
  function getBasket() {
    let basket = JSON.parse(localStorage.getItem("panier"));
    return basket;
  }
  
//Fonction pour l'affichage du panier
function cartDisplay(api, panier) {
  for (article of panier) {
    //On retrouve dans l'API l'article correspondant au local storage
    itemApi = api.find((p) => p._id == article.id);
    //On modifie dans le DOM
    document.querySelector("#cart__items").innerHTML += `
        <article class="cart__item" data-id="{${article.id}}" data-color="{${article.couleur}}">
                <div class="cart__item__img">
                  <img src="${itemApi.imageUrl}" alt="${itemApi.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${itemApi.name}</h2>
                    <p>${article.couleur}</p>
                    <p>${itemApi.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :  </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
        `;
  }
}

//Fonction pour récupérer le nombre d'éléments du panier
function getTotalQuantity(panier) {
  let quantity = 0;
  for (article of panier) {
    quantity += Number(article.quantity);
  }
  return quantity;
}

//Fonction pour calculer le prix total du panier
function getTotalPrice(panier,api) {
    itemApi = api.find((p) => p._id == article.id)
    let price = 0;
    for (article of panier) {
    price += Number(article.quantity) * Number(itemApi.price);
    }
    return price;
  }