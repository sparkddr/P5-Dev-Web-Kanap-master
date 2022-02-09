//Afficher un article sur la page produit

//Récuprération de l'id de l'article
let str = window.location.href;
let url = new URL(str);
let idArticle = url.searchParams.get("id");

//Ajout des infos de l'article sur la page en fonction de l'ID
fetch(`http://localhost:3000/api/products/${idArticle}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  // Ajout de chaque information sur la page
  .then(function (value) {
    const article = value;
    document.querySelector(".item__img").innerHTML = `
              <img src="${article.imageUrl}" alt="${article.altTxt}">
              `;
    document.querySelector("#title").innerHTML = `
        ${article.name}`;
    document.querySelector("#price").innerHTML = `
        ${article.price}`;
    document.querySelector("#description").innerHTML = `
        ${article.description}`;
    const colors = article.colors;
    for (let color of colors) {
      document.querySelector("#colors").innerHTML += `
        <option value="${color}">${color}</option>`;
    }
  })
  .catch(function (err) {
    //Une erreur est survenue
  });

/////////Ajout d'un produit au panier///////

const panier = document.querySelector("#addToCart");
panier.addEventListener("click", function (event) {
  //On récupère les infos de quantité et de couleurs

  addBasket();
});

//Fonction pour récupérer le panier
function getBasket() {
  let basket = JSON.parse(localStorage.getItem("panier"));
  return basket;
}

//Fonction pour ajouter au panier
function addBasket() {
  let color = document.querySelector("#colors").value;
  let itemQuantity = document.querySelector("#quantity").value;
  let article = {
    couleur: color,
    quantity: itemQuantity,
    id: idArticle,
  };
  //On crée un tableau pour entreposer les objets et un tableau final qui sera utilisé pour pusher sur le local storage
  let tableauStorage = [];
  let finalArray;
  //On récupère le panier dans le local Storage pour comparer les éléments déja présents
  let panier = getBasket();
  //On vérifie si le panier existe
  if (panier !== null) {
    //On regarde si l'ID est présent dans le panier
    let verifId = panier.filter((e) => e.id === idArticle);
    if (verifId != undefined) {
      let verifColor = verifId.find((p) => p.couleur == color);
      console.log(verifColor);
      if (verifColor != undefined) {
        let quantityAdjustement = 0;
        quantityAdjustement += Number(verifColor.quantity);
        quantityAdjustement += Number(itemQuantity);
        verifColor.quantity = quantityAdjustement;
      } else {
        tableauStorage.push(article);
      }
    } else {
      //Si l'ID n'est pas présent on ajoute l'objet entier au tableau
      tableauStorage.push(article);
    }
    //On fusionne les différents paniers dans le panier final
    finalArray = tableauStorage.concat(panier);
    //Si le panier n'existe pas on rajoute simplement l'objet dans notre tableau local puis final
  } else {
    tableauStorage.push(article);
    finalArray = tableauStorage;
  }
  console.log(finalArray);

  //On met lobjet JSon dans le local Storage (en JSON)
  localStorage.setItem("panier", JSON.stringify(finalArray));
}
