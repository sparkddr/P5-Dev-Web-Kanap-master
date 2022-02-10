let api;

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    api = value;
    let panier = getBasket();
    //Affichage du panier
    cartDisplay(api, panier);
    //Ajout de la quantité et du prix dans le DOM
    document.querySelector("#totalQuantity").innerHTML =
      getTotalQuantity(panier);
    document.querySelector("#totalPrice").innerHTML = getTotalPrice(
      panier,
      api
    );
  })
  .catch(function (err) {
    //Une erreur est survenue
  });

//Supprimer avec le bouton supprimer
setTimeout(function removeItem() {
  
  let buttonsDelete = document.querySelectorAll(".deleteItem");
  for (let button of buttonsDelete) {
    button.addEventListener("click", function () {
        panier = getBasket();
      //On récupère l'ID de la donnée modifiée
      let idItem = this.closest(".cart__item").dataset.id;
      //On récupère la couleur de la donnée modifiée
      let colorItem = this.closest(".cart__item").dataset.color;
      removeBasket(idItem,colorItem,panier)
    });
  }
  //On cherche l'index dans le panier
}, 400);

//Fonction pour supprimer un élément du panier
function removeBasket(idItem,colorItem,panier){
    //Suppression de l'affichage
    console.log(colorItem);
    let elementToRemove = document.querySelector(`article[data-id="${idItem}"][data-color="${colorItem}"]`)
      console.log(elementToRemove);
      document.querySelector("#cart__items").removeChild(elementToRemove)
    //Suppression dans le local storage
    //On récupère le bon iD dans le panier
    let findId = panier.filter((e) => e.id === idItem);
    //Puis on récupère la couleur
    let findColor = findId.find((e) => e.couleur == colorItem);
    let index = panier.indexOf(findColor);
    console.log(findColor);
    console.log(findId);
    console.log(index);
    //On supprime l'élément du panier
    if (index>= 0){
        panier.splice(index, 1);}
        //On met a jour le panier et les prix
        localStorage.setItem("panier", JSON.stringify(panier));
        updatePriceQuantity(panier,api);
}

//Fonction permettant de modifier le nombre d'éléments dans le panier
setTimeout(modifyQuantity, 400);
function modifyQuantity() {
  let quantityInCart = document.querySelectorAll(".itemQuantity");
  for (let input of quantityInCart) {
    input.addEventListener("change", function () {
      let panier = getBasket();
      //On récupère l'ID de la donnée modifiée
      idItem = this.closest(".cart__item").dataset.id;
      //On récupère la couleur de la donnée modifiée
      colorItem = this.closest(".cart__item").dataset.color;
      //On récupère le bon iD dans le panier
      let findId = panier.filter((e) => e.id === idItem);
      //Puis on récupère la couleur
      let findColor = findId.find((e) => e.couleur == colorItem);
      if(this.value > 0){
        findColor.quantity = this.value;
        //On Push le panier dans le local Storage
      localStorage.setItem("panier", JSON.stringify(panier));
      //On met à jour le prix et le nombre d'article
      updatePriceQuantity(panier,api)
      }else{
        removeBasket(idItem,colorItem,panier)
      }

    });
  }
}

//Fonction pour récupérer le panier en tableau
function getBasket() {
  let basket = JSON.parse(localStorage.getItem("panier"));
  return basket;
}

//Fonction pour l'affichage du panier
function cartDisplay(api, panier) {
  let fragment = document.createDocumentFragment();
  for (article of panier) {
    //On retrouve dans l'API l'article correspondant au local storage
    itemApi = api.find((p) => p._id == article.id);
    //On modifie dans le DOM
    let choice = document.createElement("article");
    choice.setAttribute("class", "cart__item");
    choice.setAttribute("data-id", `${article.id}`);
    choice.setAttribute("data-color", `${article.couleur}`);
    choice.innerHTML = `<div class="cart__item__img">
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
</article>`;
    fragment.appendChild(choice);
  }
  document.querySelector("#cart__items").appendChild(fragment);
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
function getTotalPrice(panier, api) {
  itemApi = api.find((p) => p._id == article.id);
  let price = 0;
  for (article of panier) {
    price += Number(article.quantity) * Number(itemApi.price);
  }
  return price;
}

//Fonction pour udpate l'affichage du prix et de la quantité
function updatePriceQuantity(panier,api) {
  document.querySelector("#totalQuantity").innerHTML = getTotalQuantity(panier);
  document.querySelector("#totalPrice").innerHTML = getTotalPrice(panier, api);
}
