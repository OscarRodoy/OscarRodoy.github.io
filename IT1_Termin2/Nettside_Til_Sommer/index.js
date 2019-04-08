  // Variabel som referer til main-elementet
const main = document.querySelector("main");
const selectProdukt = document.querySelector("#selectProdukt");
const selectRekkefolge = document.querySelector("#selectRekkefolge");
  // Referanser til databasen
const db = firebase.database();

const Produkter = db.ref("Produkter"); //trengs ikke?
const VersaceKlokker = db.ref("Produkter/versaceKlokker");
const RolexKlokker = db.ref("Produkter/rolexKlokker");
const GucciKlokker = db.ref("Produkter/gucciKlokker");

function genererHTML(snapshot){
      //Javascript-funksjon som skriver varene ut på nettsiden i main-elementet
    let produktSnap = snapshot.val();
    console.log(produktSnap);
    //let parent = snapshot.ref.parent.key;
    let key = snapshot.key;
    //let ref = parent +"/" + key
    main.innerHTML +=`
          <section class="secProdukter">
            <img src="${produktSnap.bildeURL}">
            <a href="Underside.html?id=${key}">Les mer</a>
            <p>${produktSnap.Pris}</p>
          </section>
    `;
}

function visAlle(){
  main.innerHTML = `
          <section class="row-span2">
            <img src="">
          </section>`;
  VersaceKlokker.on("child_added", genererHTML);
  RolexKlokker.on("child_added", genererHTML);
}

function sortering(select){
  if(select.value == "lavHoy"){
    visLavTilHoy();
  }
  else if (select.value == "hoyLav"){
    visHoyTilLav();
  }
  else if (select.value == "aTilAA"){
    visATilAA();
  }
  else if (select.value == "tilbud"){
    visTilbud();
  }
}

visAlle();
