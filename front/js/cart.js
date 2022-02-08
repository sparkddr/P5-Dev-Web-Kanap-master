let tableau = [{
    couleur : 'bleue',
    voiture : 'mercedes'
}]

 let verif = tableau.filter(e => e.couleur === 'bleue').length >0
console.log(verif);

console.log(tableau.item.couleur);