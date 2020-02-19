function gameOver(){
  if (objekterFjernet == objekter.objektCount){
    gameoverSide.querySelector("h1").innerHTML = "Du vant!";
  } else {
    gameoverSide.querySelector("h1").innerHTML = "Game Over";
  };
  statistikk.innerHTML = `
    <p style="margin: 10px; text-decoration: underline;">Statistikk:</p>
    <table>
      <tr>
        <td>Objekter:</td>
        <td>${objekterFjernet} / ${objekter.rows * objekter.columns}</td>
      </tr>
      <tr>
        <td>Tid:</td>
        <td>${minutter}:${sekunder}</td>
      </tr>
      <tr>
        <td><b>Score:</b></td>
        <td><b>${score}</b></td>
      </tr>
    </table>
  `;
  spiller = new lagSpiller();
  ball = new lagBall();
  controller.a = controller.d = controller.leftArrow = controller.rightArrow = false;
  clearInterval(timerInterval);
  startSpill = false;
  tid = 0;
  objekterFjernet = 0;
  lagObjektArray();
  tegnSpill();
  oppdaterSpill();
  visObjekterFjernet.innerHTML = `<p>${objekterFjernet} / ${objekter.objektCount}</p>`;
  timer.innerHTML = `<p>0:00</p>`;
  displayGrid.style.opacity = "0.3";
  gameoverSide.style.display = "block";
  setTimeout(function(){
    do {
      navn = prompt("(Maks 12 symboler) Skriv inn navnet ditt her:");
    } while (navn == null || navn == "" || navn.length > 12);
    rekordArray.push({navn: navn, score: score});
    rekordArray.sort(sorterRekorder);
    score = 0;
    visScore.innerHTML = `<p>0</p>`;
  }, 10);
};

function sorterRekorder(a, b){
  return b.score - a.score;
};

fortsettKnapp.onclick = function(){
  startSide.style.display = "block";
  gameoverSide.style.display = "none";
  rekorder.innerHTML = `<p style="margin: 10px; text-decoration: underline;">Rekorder:</p><table id="rekordTabell"></table>`;
  for (var i = 0; i < 3; i++){
    if (i >= rekordArray.length) {return;};
    var plass = i + 1;
    document.getElementById("rekordTabell").innerHTML += `
      <tr>
        <td>${plass}.</td>
        <td>${rekordArray[i].navn}:</td>
        <td>${rekordArray[i].score}</td>
      </tr>
    `;
  };
};
