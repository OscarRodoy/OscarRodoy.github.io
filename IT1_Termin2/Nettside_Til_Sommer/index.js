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
    let parent = snapshot.ref.parent.key;
    let key = snapshot.key;
    let ref = parent +"/" + key
    main.innerHTML +=`
          <section class="secProdukter">
            <a href="ProduktInfo.html?id=${ref}">Trykk her for detaljer</a>
            <img onmouseover="document.querySelector('#stickyPhoto').src='${produktSnap.bildeURL2}';document.querySelector('#stickyLink').href='ProduktInfo.html?id=${ref}';document.querySelector('#stickyHeader').innerHTML='${produktSnap.KlokkeNavn}'" src="${produktSnap.bildeURL}">
            <p>${produktSnap.Pris} kr</p>
          </section>
    `;
}

function genererHTMLSnudd(snapshot){
      //Javascript-funksjon som skriver varene ut på nettsiden i main-elementet
    let produktSnap = snapshot.val();
    console.log(produktSnap);
    let parent = snapshot.ref.parent.key;
    let key = snapshot.key;
    let ref = parent +"/" + key
    main.innerHTML =`
          <section class="secProdukter">
            <a href="ProduktInfo.html?id=${ref}">Trykk her for detaljer</a>
            <img onmouseover="document.querySelector('#stickyPhoto').src='${produktSnap.bildeURL2}';document.querySelector('#stickyLink').href='ProduktInfo.html?id=${ref}';document.querySelector('#stickyHeader').innerHTML='${produktSnap.KlokkeNavn}'" src="${produktSnap.bildeURL}">
            <p>${produktSnap.Pris} kr</p>
          </section>
    ` + main.innerHTML;
}

function genererStickyBOX(snapshot){
      //Javascript-funksjon som skriver varene ut på nettsiden i main-elementet
    let produktSnap = snapshot.val();
    console.log(produktSnap);
    let parent = snapshot.ref.parent.key;
    let key = snapshot.key;
    let ref = parent +"/" + key
    var stickyBOX = document.getElementById("stickyBOX")
    stickyBOX.innerHTML +=`
            <img id="stickyPhoto" src="${produktSnap.bildeURL2}">
            <div class="transparentBOX"></div>
            <h1 id="stickyHeader">${produktSnap.KlokkeNavn}</h1>
            <a id="stickyLink" href="ProduktInfo.html?id=${ref}">Se detaljer</a>
    `;
}


function visAlle(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  //VersaceKlokker.on("child_added", genererHTML);
  //RolexKlokker.on("child_added", genererHTML);
  //GucciKlokker.on("child_added", genererHTML);

  visLavTilHoy();

  //VersaceKlokker.orderByChild("Pris").limitToFirst(1).on("child_added", genererStickyBOX);
}

function visLavTilHoy(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  VersaceKlokker.orderByChild("Pris").on("child_added", genererHTML);
  RolexKlokker.orderByChild("Pris").on("child_added", genererHTML);
  GucciKlokker.orderByChild("Pris").on("child_added", genererHTML);
  VersaceKlokker.orderByChild("Pris").limitToFirst(1).on("child_added", genererStickyBOX);
}

function visHoyTilLav(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  VersaceKlokker.orderByChild("Pris").on("child_added", genererHTMLSnudd);
  RolexKlokker.orderByChild("Pris").on("child_added", genererHTMLSnudd);
  GucciKlokker.orderByChild("Pris").on("child_added", genererHTMLSnudd);
  VersaceKlokker.orderByChild("Pris").limitToLast(1).on("child_added", genererStickyBOX);
}

function visATilAA(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  VersaceKlokker.orderByChild("KlokkeNavn").on("child_added", genererHTML);
  RolexKlokker.orderByChild("KlokkeNavn").on("child_added", genererHTML);
  GucciKlokker.orderByChild("KlokkeNavn").on("child_added", genererHTML);
  VersaceKlokker.orderByChild("KlokkeNavn").limitToFirst(1).on("child_added", genererStickyBOX);
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
}

visAlle();
