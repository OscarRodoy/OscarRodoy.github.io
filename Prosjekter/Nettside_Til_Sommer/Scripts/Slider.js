function visIMG1(){
  var LitenSkjermVisning = document.getElementById("LitenSkjermVisning")
  LitenSkjermVisning.innerHTML = `
      <img src="ProduktBilder/Versace_klokke7_img2.jpg">
      <a href="Produktinfo.html?id=versaceKlokker/versace_7">Se detaljer</a>
      <h1>GLAZE - Klokke - bracelet gold</h1>
  `;
  document.getElementById("LeftButton").onclick = visIMG3;
  document.getElementById("RightButton").onclick = visIMG2;
}
function visIMG2(){
  var LitenSkjermVisning = document.getElementById("LitenSkjermVisning")
  LitenSkjermVisning.innerHTML = `
      <img src="ProduktBilder/Versace_klokke3_img2.jpg">
      <a href="Produktinfo.html?id=versaceKlokker/versace_3">Se detaljer</a>
      <h1>ABERDEEN EXTENSION - Klokke - gold</h1>
  `;
  document.getElementById("LeftButton").onclick = visIMG1;
  document.getElementById("RightButton").onclick = visIMG3;
}
function visIMG3(){
  var LitenSkjermVisning = document.getElementById("LitenSkjermVisning")
  LitenSkjermVisning.innerHTML = `
      <img src="ProduktBilder/Versace_klokke5_img2.jpg">
      <a href="Produktinfo.html?id=versaceKlokker/versace_5">Se detaljer</a>
      <h1>V-CIRCLE THE CLANS EDITION - Klokke</h1>
  `;
  document.getElementById("LeftButton").onclick = visIMG2;
  document.getElementById("RightButton").onclick = visIMG1;
}
