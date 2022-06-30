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
    updatePriceQuantity(panier, api);
  })
  .then(() => {
    removeItem();
    modifyQuantity();
  })
  .catch(function (err) {
    console.log(err);
  });

//Supprimer avec le bouton supprimer
function removeItem() {
  let buttonsDelete = document.querySelectorAll(".deleteItem");
  for (let button of buttonsDelete) {
    button.addEventListener("click", function () {
      let panier = getBasket();
      //On récupère l'ID de la donnée modifiée
      let idItem = this.closest(".cart__item").dataset.id;
      //On récupère la couleur de la donnée modifiée
      let colorItem = this.closest(".cart__item").dataset.color;
      removeBasket(idItem, colorItem, panier);
    });
  }
  //On cherche l'index dans le panier
}

//Fonction permettant de modifier le nombre d'éléments dans le panier
function modifyQuantity() {
  let quantityInCart = document.querySelectorAll(".itemQuantity");
  for (let input of quantityInCart) {
    input.addEventListener("change", function () {
      let panier = getBasket();
      //On récupère l'ID de la donnée modifiée
      let idItem = this.closest(".cart__item").dataset.id;
      //On récupère la couleur de la donnée modifiée
      let colorItem = this.closest(".cart__item").dataset.color;
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

//Fonction pour récupérer le panier en tableau JS
function getBasket() {
  let basket = JSON.parse(localStorage.getItem("panier"));
  return basket;
}

//Fonction pour l'affichage du panier
function cartDisplay(api, panier) {
  let fragment = document.createDocumentFragment();
  for (let article of panier) {
    //On retrouve dans l'API l'article correspondant au local storage
    let itemApi = api.find((p) => p._id == article.id);
    //On modifie dans le DOM
    //On crée l'élément article
    let choice = document.createElement("article");
    choice.setAttribute("class", "cart__item");
    choice.setAttribute("data-id", `${article.id}`);
    choice.setAttribute("data-color", `${article.couleur}`);
    //Premiere div
    let divOne = document.createElement("div");
    divOne.classList.add("cart__item__img");
    let imgOne = document.createElement("img");
    imgOne.src = itemApi.imageUrl;
    imgOne.alt = itemApi.altTxt;
    divOne.appendChild(imgOne);
    choice.appendChild(divOne);

    //Deuxieme div
    let divTwo = document.createElement("div");
    divTwo.classList.add("cart__item__content");

    let divTwoOne = document.createElement("div");
    divTwoOne.classList.add("cart__item__content__description");
    let titre = document.createElement("h2");
    titre.textContent = itemApi.name;
    divTwoOne.appendChild(titre);
    let paraOne = document.createElement("p");
    paraOne.textContent = article.couleur;
    divTwoOne.appendChild(paraOne);
    let paraTwo = document.createElement("p");
    paraTwo.textContent = itemApi.price + "€";
    divTwoOne.appendChild(paraTwo);
    divTwo.appendChild(divTwoOne);

    let divTwoTwo = document.createElement("div");
    divTwoTwo.classList.add("cart__item__content__settings");
    let divTwoTwoOne = document.createElement("div");
    divTwoTwoOne.classList.add("cart__item__content__settings__quantity");
    let paraQ = document.createElement("p");
    paraQ.textContent = "Qté :  ";
    let inputQ = document.createElement("input");
    inputQ.type = "number";
    inputQ.classList.add("itemQuantity");
    inputQ.name = "itemQuantity";
    inputQ.min = 1;
    inputQ.max = 100;
    inputQ.value = article.quantity;
    divTwoTwoOne.appendChild(paraQ);
    divTwoTwoOne.appendChild(inputQ);
    divTwoTwo.appendChild(divTwoTwoOne);
    divTwo.appendChild(divTwoTwo);

    let divTwoThree = document.createElement("div");
    divTwoThree.classList.add("cart__item__content__settings__delete");
    let paraD = document.createElement("p");
    paraD.classList.add("deleteItem");
    paraD.textContent = "Supprimer";
    divTwoThree.appendChild(paraD);
    divTwo.appendChild(divTwoThree);

    choice.appendChild(divTwo);

    fragment.appendChild(choice);
  }
  document.querySelector("#cart__items").appendChild(fragment);
}

//Fonction pour supprimer un élément du panier
function removeBasket(idItem, colorItem, panier) {
  //Suppression de l'affichage
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
  for (let article of panier) {
    quantity += Number(article.quantity);
  }
  return quantity;
}

//Fonction pour calculer le prix total du panier
function getTotalPrice(panier, api) {
  let price = 0;
  for (let article of panier) {
    let itemApi = api.find((p) => p._id == article.id);
    price += Number(article.quantity) * Number(itemApi.price);
  }
  return price;
}

//Fonction pour udpate l'affichage du prix et de la quantité
function updatePriceQuantity(panier, api) {
  document.querySelector("#totalQuantity").textContent =
    getTotalQuantity(panier);
  document.querySelector("#totalPrice").textContent = getTotalPrice(
    panier,
    api
  );
}

////////////////////Validation du formulaire////////////

let form = document.querySelector(".cart__order__form");
function validation() {
  try {
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
    commander();
  } catch (error) {
    console.log("Page confirmation");
  }
}
validation();

//Validation avec Bouton Commander
function commander() {
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
      sendApi(command);
    }
  });
}

//Fonction pour envoyer la requete post avec les infos contacts à L'API
function sendApi(command) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (value) {
      return value.orderId;
    })
    .then(function (orderId) {
      window.location.href = "confirmation.html?" + `id=${orderId}`;
      localStorage.clear();
      return orderId;
    })
    .catch(function (error) {
      // catch
      console.log("Request failed", error);
    });
}

/////////********REGEXP POUR VALIDATION*************///////////
//Fonction Validation Nom
function validName(inputName) {
  //Création Regexp validation email
  let nameRegExp = new RegExp(`^[a-z .'-]+$`, "i");
  let testName = nameRegExp.test(inputName.value);
  //On récupère le paragraphe pour afficher le résultat
  let message = inputName.nextElementSibling;
  if (!testName) {
    message.textContent = "Renseignement Non Valide";
    return false;
  } else {
    message.textContent = "";
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
    message.textContent = "Renseignement Non Valide";
    return false;
  } else {
    message.textContent = "";
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
    message.textContent = "Adresse Non Valide";
    return false;
  } else {
    message.textContent = "";
    return true;
  }
}

//////*********** Affichage ID Commande page confirmation **********///////////

//On récupère l'ID
function idPage() {
  let url = new URL(window.location.href);
  let idArticle = url.searchParams.get("id");
  if (idArticle != undefined) {
    document.querySelector("#orderId").textContent = idArticle;
  }
}
idPage();
