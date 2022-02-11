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
      removeBasket(idItem, colorItem, panier);
    });
  }
  //On cherche l'index dans le panier
}, 400);

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
      if (this.value > 0) {
        findColor.quantity = this.value;
        //On Push le panier dans le local Storage
        localStorage.setItem("panier", JSON.stringify(panier));
        //On met à jour le prix et le nombre d'article
        updatePriceQuantity(panier, api);
      } else {
        removeBasket(idItem, colorItem, panier);
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

//Fonction pour supprimer un élément du panier
function removeBasket(idItem, colorItem, panier) {
  //Suppression de l'affichage
  console.log(colorItem);
  let elementToRemove = document.querySelector(
    `article[data-id="${idItem}"][data-color="${colorItem}"]`
  );
  console.log(elementToRemove);
  document.querySelector("#cart__items").removeChild(elementToRemove);
  //Suppression dans le local storage
  //On récupère le bon iD dans le panier
  let findId = panier.filter((e) => e.id === idItem);
  //Puis on récupère la couleur
  let findColor = findId.find((e) => e.couleur == colorItem);
  let index = panier.indexOf(findColor);
  //On supprime l'élément du panier
  if (index >= 0) {
    panier.splice(index, 1);
  }
  //On met a jour le panier et les prix
  localStorage.setItem("panier", JSON.stringify(panier));
  updatePriceQuantity(panier, api);
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
function updatePriceQuantity(panier, api) {
  document.querySelector("#totalQuantity").innerHTML = getTotalQuantity(panier);
  document.querySelector("#totalPrice").innerHTML = getTotalPrice(panier, api);
}

////////////////////Création des RegExp pour validation du formulaire////////////

let form = document.querySelector(".cart__order__form");

//On crée une promise
const validation = new Promise(function(resolve,reject){
  resolve('sucess');
  reject('echec')
})
validation
  .then(function(){
    //On écoute la modification de l'email
form.email.addEventListener("change", function () {
  validEmail(this);
});
//On écoute la modification du prénom
form.firstName.addEventListener("change", function () {
  validName(this);
});
//On écoute la modif du nom
form.lastName.addEventListener("change", function () {
  validName(this);
});
//On écoute la modif de l'adresse
form.address.addEventListener("change", function () {
  validAddress(this);
});
//On écoute la modif de la Ville
form.city.addEventListener("change", function () {
  validName(this);
});
    commander()
  })
  .catch(function(data){
    console.log(data);
  })
//Validation avec Bouton Commander
function commander(){
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(form.firstName.value);
  if (
    validName(form.firstName) &&
    validName(form.lastName) &&
    validName(form.city) &&
    validAddress(form.address) &&
    validEmail(form.email)
  ) {
    let contact = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      city: form.city.value,
      address: form.address.value,
      email: form.email.value,
    };
    let panier = getBasket();
    let products = [];
    for (let article of panier) {
      products.push(article.id);
    }
    let command = { contact: contact, products: products };
    console.log(command);

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    })
      .then(function (res) {
        console.log(res);
        return res.json();
      })
      .then(function (value) {
        console.log(value);
        return value.orderId;
      })
      .then(function (orderId) {
        window.location.href = "confirmation.html?" + `id=${orderId}`;
        localStorage.clear()
        return orderId;
      })
      .catch(function (error) {
        // catch
        console.log("Request failed", error);
      });
  }
});}


//Fonction Validation Nom
function validName(inputName) {
  //Création Regexp validation email
  let nameRegExp = new RegExp(`^[a-z .'-]+$`, "i");
  let testName = nameRegExp.test(inputName.value);
  //On récupère le paragraphe pour afficher le résultat
  let message = inputName.nextElementSibling;
  if (!testName) {
    message.innerHTML = "Renseignement Non Valide";
    return false;
  } else {
    message.innerHTML = "";
    return true;
  }
}

function validAddress(inputAddress) {
  //Création Regexp validation email
  let addressRegExp = new RegExp(`^[a-z0-9 .'-]+$`, "i");
  let testAddress = addressRegExp.test(inputAddress.value);
  //On récupère le paragraphe pour afficher le résultat
  let message = inputAddress.nextElementSibling;
  if (!testAddress) {
    message.innerHTML = "Renseignement Non Valide";
    return false;
  } else {
    message.innerHTML = "";
    return true;
  }
}

//Fonction Validation Email
function validEmail(inputEmail) {
  //Création Regexp validation email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  let testEmail = emailRegExp.test(inputEmail.value);
  //On récupère le paragraphe pour afficher le résultat
  let message = inputEmail.nextElementSibling;
  if (!testEmail) {
    message.innerHTML = "Adresse Non Valide";
    return false;
  } else {
    message.innerHTML = "";
    return true;
  }
}

///Affichage ID Commande page confirmation

//On récupère l'ID

const idOrder = new Promise(function (resolve, reject) {
  resolve("success");
  reject("echec");
});
idOrder
  .then(function () {
    let url = new URL(window.location.href);
    let idArticle = url.searchParams.get("id");
    document.querySelector("#orderId").innerHTML = idArticle;
  })
  .catch(function(data){
    console.log(data);
  })
