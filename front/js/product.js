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

/*const panier = document.querySelector("#addToCart");
panier.addEventListener("click", function (event) {
  let color = document.querySelector("#colors").value;
  let itemQuantity = document.querySelector("#quantity").value;
  let item = {"couleur" :`${color}` , "quantity" : `${itemQuantity}` , "id": `${idArticle}`};
  console.log(item);
  
  let cartItemLinea = JSON.stringify(item);
  localStorage.setItem("article",cartItemLinea)
  localStorage.setItem("couleur", array)
  console.log(localStorage);
  console.log(localStorage.length);
  
});*/

localStorage.clear();

const panier = document.querySelector("#addToCart");
panier.addEventListener("click", function (event) {
  //On récupère les infos de quantité et de couleurs

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
  let panierLinea = localStorage.getItem("panier");
  console.log(panierLinea);
  let panier = JSON.parse(panierLinea);
  console.log(panier);
  //On vérifie si le panier existe
  if (panier !== null) {
    //On regarde si l'ID est présent dans le panier
    let verifId = panier.filter((e) => e.id === idArticle).length > 0;
    if (verifId) {
      //Si l'ID est présent on rajoute seulement la quantité
      let idIndex = panier.findIndex((obj) => obj.id == idArticle);
      let quantityAdjustement = 0;
      quantityAdjustement += Number(panier[idIndex].quantity);
      quantityAdjustement += Number(itemQuantity);
      panier[idIndex].quantity = quantityAdjustement;
      console.log(panier);
      console.log("sucess");
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
  //On met le tableau en objet Json
  let finalArrayLinea = JSON.stringify(finalArray);

  //On met lobjet JSon dans le local Storage
  localStorage.setItem("panier", finalArrayLinea);
});
