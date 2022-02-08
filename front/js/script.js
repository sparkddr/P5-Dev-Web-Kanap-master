//Contact de l'API
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then (function(value){
    const articles = value;
    for (let article of articles) {
      document.getElementById('items').innerHTML += `
      <a href="./product.html?id=${article._id}">
      <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3 class="productName">${article.name}</h3>
        <p class="productDescription">${article.description}</p>
      </article>
    </a>
    `
    }
  })
  .catch(function (err) {
    //Une erreur est survenue
  });

// Afficher tout les articles  

