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
            <a href="Underside.html?id=${key}">Se detaljer</a>
            <img onmouseover="visHoveredElement()" src="${produktSnap.bildeURL}">
            <p>${produktSnap.Pris}</p>
          </section>
    `;
}

function genererStickyBOX(snapshot){
      //Javascript-funksjon som skriver varene ut på nettsiden i main-elementet
    let produktSnap = snapshot.val();
    console.log(produktSnap);
    //let parent = snapshot.ref.parent.key;
    let key = snapshot.key;
    //let ref = parent +"/" + key
    var stickyBOX = document.getElementById("stickyBOX")
    stickyBOX.innerHTML +=`
            <img src="${produktSnap.bildeURL2}">
            <div class="transparentBOX"></div>
            <a href="Underside.html?id=${key}">Se detaljer</a>
    `;
}

function visHoveredElement(){
  VersaceKlokker.alert(this.id).on("child_added", genererStickyBOX);
}

function visAlle(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  VersaceKlokker.on("child_added", genererHTML);
  RolexKlokker.on("child_added", genererHTML);
  GucciKlokker.on("child_added", genererHTML);

  VersaceKlokker.orderByChild("Pris").limitToFirst(1).on("child_added", genererStickyBOX);
}

function visLavTilHoy(){
  VersaceKlokker.orderByChild("Pris").on("child_added", genererHTML);
  RolexKlokker.orderByChild("Pris").on("child_added", genererHTML);
  GucciKlokker.orderByChild("Pris").on("child_added", genererHTML);
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
