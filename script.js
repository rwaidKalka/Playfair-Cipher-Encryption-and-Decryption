// HTML element selectors inputs and buttons
//Encryption Selectors
const plainText = document.querySelector("#plainText");
const plainTextButton = document.getElementById("plainTextButton");
const plainTextResult = document.getElementById("plainResult");
const encryptSlices = document.getElementById("encryptSlices");
//Decryption Selectors
const cipherText = document.querySelector("#cipherText");
const cipherTextButton = document.getElementById("cipherTextButton");
const cipherTextResult = document.getElementById("cipherResult");
const decryptSlices = document.getElementById("decryptSlices");

// on show cipher text button clicked
plainTextButton.addEventListener("click", () => {
  const cipherText = encryptPlayfairCipher(plainText.value.trim());
  plainTextResult.innerText = cipherText;
  scrollToEnd();
});

// on show plain text button clicked
cipherTextButton.addEventListener("click", () => {
  const plainText = decryptPlayfairCipher(cipherText.value.trim());
  cipherTextResult.innerText = plainText;
  scrollToEnd();
});

const matrix = [
  ["L", "G", "D", "B", "A"],
  ["Q", "M", "H", "E", "C"],
  ["U", "R", "N", "I/J", "F"],
  ["X", "V", "S", "O", "K"],
  ["Z", "Y", "W", "T", "P"],
];

function matrixContains(letter) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (
        matrix[i][j] === letter ||
        matrix[i][j].includes(letter.toUpperCase())
      ) {
        return true;
      }
    }
  }
  return false;
}

// remove String letter at specified index
function removeAt(str, idx) {
  return str.substr(0, idx) + str.substr(idx + 1);
}

function getLetterSlices(text, isEncrypt = true) {
  let newText = "";
  //Check for validation by removing spaces and symbols from the text only letters remains
  for (let letter of text) {
    if (matrixContains(letter) && letter !== "/") {
      newText += letter.toUpperCase();
    }
  }

  let correctText = "";
  if (isEncrypt) {
    for (let i = 0; i < newText.length; i++) {
      const currentLetter = newText[i].toUpperCase();
      if (i != newText.length - 1) {
        const nextLetter = newText[i + 1].toUpperCase();
        // if current letter is equal to next letter then a bogus letter X is inserted between them
        if (currentLetter == nextLetter) {
          correctText += currentLetter + "X";
          newText = removeAt(newText, i + 1);
          i = i - 1;
        } else {
          correctText += currentLetter;
        }
      } else {
        correctText += currentLetter;
      }
    }
  } else {
    correctText = newText;
  }
  //if the length of text is odd then a bogus letter X is inserted at the end
  if (correctText.length % 2 != 0) {
    correctText += "X";
  }

  const array = [];
  //split the text into two letter slices
  for (let i = 0; i < correctText.length; i += 2) {
    array.push(correctText.substring(i, i + 2));
  }

  return array;
}

/// Finds the row and column index of letter in matrix
function getPositionOfLetter(a) {
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      const column = row[j];
      if (column == a || column.includes(a)) {
        return [i, j];
      }
    }
  }
}

//Encrypts the plain text
function encryptPlayfairCipher(text) {
  //reset UI from prevoius result
  encryptSlices.innerHTML = "";

  //get slices of text
  const letterSlices = getLetterSlices(text);

  const encryptedArray = [];
  for (let i = 0; i < letterSlices.length; i++) {
    const a = letterSlices[i][0];
    const b = letterSlices[i][1];
    let [firstLetterRow, firstLetterColumn] = getPositionOfLetter(a);
    let [secondLetterRow, secondLetterColumn] = getPositionOfLetter(b);

    let newLetters = "";

    ///Same row shift right
    if (firstLetterRow == secondLetterRow) {
      firstLetterColumn = (firstLetterColumn + 1) % 5;
      secondLetterColumn = (secondLetterColumn + 1) % 5;

      newLetters += matrix[firstLetterRow][firstLetterColumn];
      newLetters += matrix[secondLetterRow][secondLetterColumn];
    }

    ///Same Column shift down
    else if (firstLetterColumn == secondLetterColumn) {
      firstLetterRow = (firstLetterRow + 1) % 5;
      secondLetterRow = (secondLetterRow + 1) % 5;

      newLetters += matrix[firstLetterRow][firstLetterColumn];
      newLetters += matrix[secondLetterRow][secondLetterColumn];
    }

    /// Not Same Column Or Row
    else {
      newLetters += matrix[firstLetterRow][secondLetterColumn];
      newLetters += matrix[secondLetterRow][firstLetterColumn];
    }

    encryptedArray.push(newLetters);
    encryptSlices.innerHTML += `<div class="sliceCard"><span>${
      a + b
    }</span> <p class="largeFont">➡</p> <span>${newLetters}</span></div>`;
  }

  return encryptedArray.join("").replaceAll("I/J", "I");
}

//Decrypts the cipher text
function decryptPlayfairCipher(text) {
  //reset UI from prevoius result
  decryptSlices.innerHTML = "";
  //get slices of text
  const letterSlices = getLetterSlices(text, false);

  const decryptedArray = [];
  for (let i = 0; i < letterSlices.length; i++) {
    const a = letterSlices[i][0];
    const b = letterSlices[i][1];
    let [firstLetterRow, firstLetterColumn] = getPositionOfLetter(a);
    let [secondLetterRow, secondLetterColumn] = getPositionOfLetter(b);

    let newLetters = "";

    ///Same row shift left
    if (firstLetterRow == secondLetterRow) {
      firstLetterColumn = (firstLetterColumn - 1) % 5;
      secondLetterColumn = (secondLetterColumn - 1) % 5;
      if (firstLetterColumn < 0) {
        firstLetterColumn = firstLetterColumn + 5;
      }
      if (secondLetterColumn < 0) {
        secondLetterColumn = secondLetterColumn + 5;
      }

      newLetters += matrix[firstLetterRow][firstLetterColumn];
      newLetters += matrix[secondLetterRow][secondLetterColumn];
    }

    ///Same Column shift up
    else if (firstLetterColumn == secondLetterColumn) {
      firstLetterRow = (firstLetterRow - 1) % 5;
      secondLetterRow = (secondLetterRow - 1) % 5;
      if (firstLetterRow < 0) {
        firstLetterRow = firstLetterRow + 5;
      }
      if (secondLetterRow < 0) {
        secondLetterRow = secondLetterRow + 5;
      }

      newLetters += matrix[firstLetterRow][firstLetterColumn];
      newLetters += matrix[secondLetterRow][secondLetterColumn];
    }

    /// Not Same Column Or Row
    else {
      newLetters += matrix[firstLetterRow][secondLetterColumn];
      newLetters += matrix[secondLetterRow][firstLetterColumn];
    }

    decryptedArray.push(newLetters);
    decryptSlices.innerHTML += `<div class="sliceCard"><span>${
      a + b
    }</span> <p class="largeFont">➡</p> <span>${newLetters}</span></div>`;
  }

  let generatedText = decryptedArray.join("");
  generatedText = generatedText.replaceAll("I/J", "I");

  let newText = getCorrectTextWithoutX(generatedText);

  return newText;
}

// removing X from the text if prevous and next letters are the same this is for the decryption
function getCorrectTextWithoutX(text) {
  let correctText = "";
  if (text.includes("X")) {
    for (let i = 0; i < text.length; i++) {
      const currentLetter = text[i].toUpperCase();
      if (currentLetter == "X" && i > 0 && i < text.length - 1) {
        const prevLetter = text[i - 1].toUpperCase();
        const nextLetter = text[i + 1].toUpperCase();

        if (prevLetter == nextLetter) {
          correctText += "";
        } else {
          correctText += currentLetter;
        }
      } else {
        correctText += currentLetter;
      }
    }

    return correctText;
  } else {
    return text;
  }
}

function scrollToEnd() {
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}
