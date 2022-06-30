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
    console.log(err);
  });

// Afficher tout les articles  
function addArticles(articles){
  let fragment = document.createDocumentFragment()
  for (let article of articles) {
    let card = document.createElement("a")
    card.setAttribute("href", `./product.html?id=${article._id}`)
    let baliseArticle = document.createElement("article")
    let image = document.createElement("img")
    image.src = article.imageUrl
    image.alt = article.altTxt
    baliseArticle.appendChild(image)
    let title = document.createElement("h3")
    title.classList.add("productName")
    title.textContent = article.name
    baliseArticle.appendChild(title)
    let para = document.createElement("p")
    para.classList.add("productDescription")
    para.textContent = article.description
    baliseArticle.appendChild(para)
    card.appendChild(baliseArticle)
  fragment.appendChild(card)
  }
  document.getElementById('items').appendChild(fragment)
}

