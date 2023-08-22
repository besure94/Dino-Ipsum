import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import DinoIpsum from './js/dinoIpsum';
import DinoGameObject from './js/dinoGameObject';

async function getDinoName() {
  let response = await DinoIpsum.getDinoName();
  if (response[0][0][0]) {
    return response[0][0][0];
  } else {
    printError(response);
  }
}

function printError(error) {
  document.querySelector("#showResponse").innerText = `There was an error accessing the Dino Data for ${error[2]}: ${error[0].status} ${error[0].statusText}: ${error[1].message}`;
}

function getLetter() {
  let letter = document.querySelector("#letter").value;
  return letter;
}

window.addEventListener("load", function () {
  document.querySelector("form#createNewGame").addEventListener("submit", function (event) {
    event.preventDefault();
    getDinoName().then(function (dinoName) {
      let dinoGameObject = new DinoGameObject(dinoName);
      let letterDiv = document.querySelector("#letterDiv");
      letterDiv.removeAttribute("class", "hidden");
      document.querySelector("form#letterInput").addEventListener("submit", function (e) {
        e.preventDefault();
        let letter = getLetter();
        if (/[^a-zA-Z\s]/g.test(letter) || letter === "") {
          document.querySelector("#showResponse").innerText = "Not a valid letter";
        } else {
          dinoGameObject.letterArray = [letter];
          if (dinoGameObject.isPreviousGuess() === false) {
            dinoGameObject.checkLetterVsDino();
            document.querySelector("p#showResponse").innerText = dinoGameObject.resultsArray;
            document.querySelector("p#previousAttempts").innerText = dinoGameObject.previousAttempts;
            dinoGameObject.updateAttemptsUsed();
            if (dinoGameObject.gameLoss === true) {
              document.querySelector("p#showResponse").innerText = "Game Over";
              let resetDiv = document.querySelector("div#resetButton");
              resetDiv.removeAttribute("class", "hidden");
              document.querySelector("#clear").addEventListener("click", function() {
                window.location.reload();
              });
            }
          } else {
            document.querySelector("p#previousAttempts").innerText = "You have already guessed that letter, enter new guess.";
          }
        }
        document.querySelector("input#letter").value = "";
      });
    });
  });
});

