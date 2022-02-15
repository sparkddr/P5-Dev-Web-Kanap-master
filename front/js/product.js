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
    pagination(value);
  })
  .catch(function (err) {
    //Une erreur est survenue
  });

//Fonction pour la mise en page
function pagination(article) {
  let image = document.createElement("img");
  image.setAttribute("src", `${article.imageUrl}`);
  image.setAttribute("alt", `${article.altTxt}`);
  document.querySelector(".item__img").appendChild(image);
  document.querySelector("#title").textContent = `
        ${article.name}`;
  document.querySelector("#price").textContent = `
        ${article.price}`;
  document.querySelector("#description").textContent = `
        ${article.description}`;
  const colors = article.colors;
  //Création des options de couleurs
  let fragment = document.createDocumentFragment();
  for (let color of colors) {
    let option = document.createElement("option");
    option.setAttribute("value", `${color}`);
    option.textContent = `${color}`;
    fragment.appendChild(option);
  }
  document.querySelector("#colors").appendChild(fragment);
}



/////////Ajout d'un produit au panier///////
const panier = document.querySelector("#addToCart");
panier.addEventListener("click", function (event) {
  //On récupère les infos du produits
  let color = document.querySelector("#colors").value;
  let itemQuantity = document.querySelector("#quantity").value;
  let article = {
    couleur: color,
    quantity: itemQuantity,
    id: idArticle,
  };
  //On ajoute au panier
  addBasket(color, itemQuantity, article);
});

//Fonction pour récupérer le panier en objet JS
function getBasket() {
  let basket = JSON.parse(localStorage.getItem("panier"));
  return basket;
}

//Fonction pour ajouter au panier
function addBasket(color,itemQuantity, article) {
  //On vérifie que des données sont bien entrée par le client
  if (color !== "" && itemQuantity > 0) {
    //On récupère le panier dans le local Storage pour comparer les éléments déja présents
    let panier = getBasket();
    //On vérifie si le panier existe
    if (panier !== null) {
      //On regarde si l'ID est présent dans le panier
      let verifId = panier.filter(e => e.id === idArticle);
      if (verifId.length > 0) {
        //On regarde si la couleur est présente dans le panier
        let verifColor = verifId.find((p) => p.couleur == color);
        if (verifColor != undefined) {
          verifColor.quantity =  (Number(verifColor.quantity) + Number(itemQuantity));
        } else {
          //Si l'ID+ mais couleur- on push l'objet entier au tableau
          panier.push(article);
        }
      } else {
        //Si l'ID n'est pas présent on ajoute l'objet entier au tableau
        panier.push(article);
      }
      //Si le panier n'existe pas on crée le tableau panier et on push l'article
    } else {
      panier = [];
      panier.push(article);
    }
    //On met lobjet JSon dans le local Storage (en JSON)
    localStorage.setItem("panier", JSON.stringify(panier));
  }
}
