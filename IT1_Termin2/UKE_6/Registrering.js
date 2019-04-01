const skjema = document.querySelector("#skjema");
const inpNavn = document.querySelector("#inpNavn");
const inpTelefon = document.querySelector("#inpTelefon");
const inpEpost = document.querySelector("#inpEpost");
const secKontakter = document.querySelector("#secKontakter");
// Firebase
const db = firebase.database();
const kontakter = db.ref("kontakter");
// Registrere en ny kontakt
function registrerKontakt(evt) {
    evt.preventDefault();
    const key = inpTelefon.value;
    const data = {
        navn: inpNavn.value,
        epost: inpEpost.value
    };
    const kontakt = kontakter.child(key);
    kontakt.set(data);

    // Nuller ut skjemaet
    skjema.reset();
}
// Knytter funksjonen til hendelsen at skjemaet blir sendt inn
skjema.addEventListener("submit", registrerKontakt);



// Funksjone som viser frem en kontakt
// snap er et snapshot av dataene til kontakten i det øyeblikket den blir lagt til
function visKontakt(snap) {
    const telefon = snap.key; // Primær-nøkkelen
    const kontakt = snap.val(); // Dataene til kontakten
    secKontakter.innerHTML += `
        <div>${kontakt.navn}</div>
        <div>${telefon}</div>
        <div>${kontakt.epost}</div>
    `;
}
// Knytter funksjonen til hendelsen at skjemaet blir sendt inn
skjema.addEventListener("submit", registrerKontakt);
// Starter funksjonen når det blir lagt til en kontakt
kontakter.on("child_added", visKontakt);
