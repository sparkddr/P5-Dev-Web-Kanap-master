//Contact de l'API
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then (function(value){
    addArticles(value)
  })
  .catch(function (err) {
    //Une erreur est survenue
  });

// Afficher tout les articles  
function addArticles(articles){
  let fragment = document.createDocumentFragment()
  for (let article of articles) {
    let card = document.createElement("a")
    card.setAttribute("href", `./product.html?id=${article._id}`)
    card.innerHTML = `<article>
    <img src="${article.imageUrl}" alt="${article.altTxt}">
    <h3 class="productName">${article.name}</h3>
    <p class="productDescription">${article.description}</p>
  </article>`
  fragment.appendChild(card)
  }
  document.getElementById('items').appendChild(fragment)
}

