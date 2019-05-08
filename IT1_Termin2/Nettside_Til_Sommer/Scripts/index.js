const main = document.querySelector("main");
const selectProdukt = document.querySelector("#selectProdukt");
const selectRekkefolge = document.querySelector("#selectRekkefolge");

const db = firebase.database();

const Produkter = db.ref("Produkter"); //trengs ikke?
const VersaceKlokker = db.ref("Produkter/versaceKlokker");
const RolexKlokker = db.ref("Produkter/rolexKlokker");
const GucciKlokker = db.ref("Produkter/gucciKlokker");

function genererHTML(snapshot){
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


let url_string = window.location.href;
let url = new URL(url_string);
let id = url.searchParams.get("id");
function visVedOpning(){
  if(id == "alleProdukter"){
    visAlle();
  }
  else if(id == "alleVersace"){
    visVersace();
  }
  else if(id == "alleRolex"){
    visRolex();
  }
  else if(id == "alleGucci"){
    visGucci();
  }
  else{
    visAlle();
  }
}

function visAlle(){
  visLavTilHoy();
}

function visVersace(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  VersaceKlokker.orderByChild("Pris").on("child_added", genererHTML);
  VersaceKlokker.orderByChild("Pris").limitToFirst(1).on("child_added", genererStickyBOX);
}

function visRolex(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  RolexKlokker.orderByChild("Pris").on("child_added", genererHTML);
  RolexKlokker.orderByChild("Pris").limitToFirst(1).on("child_added", genererStickyBOX);
}

function visGucci(){
  main.innerHTML = `
          <section class="VenstreSec">
            <section id="stickyBOX">

            </section>
          </section>`;
  GucciKlokker.orderByChild("Pris").on("child_added", genererHTML);
  GucciKlokker.orderByChild("Pris").limitToFirst(1).on("child_added", genererStickyBOX);
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

  // .addClass("RolexBackground") ??
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
  else if (select.value == "visAlle"){
    visAlle();
  }
  else if (select.value == "visVersace"){
    visVersace();
  }
  else if (select.value == "visRolex"){
    visRolex();
  }
  else if (select.value == "visGucci"){
    visGucci();
  }
}

visVedOpning();
