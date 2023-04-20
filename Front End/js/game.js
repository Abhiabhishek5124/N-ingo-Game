function startCountdown() {
    const generateBtn = document.getElementById("generate-btn");
    generateBtn.textContent = "3";
    setTimeout(() => { generateBtn.textContent = "2"; }, 1000);
    setTimeout(() => { generateBtn.textContent = "1"; }, 2000);
    setTimeout(() => {
      generateBtn.style.display = "none";
      generateNumbers();
      const readyBtn = document.getElementById("ready-btn");
      readyBtn.style.display = "inline-block";
    }, 3000);
  }
  
  function startGame() {
    // game logic goes here
  }
  
  function generateNumbers() {
    const matrix = document.getElementById("matrix");
    const numbers = new Set();
    while (numbers.size < 25) {
      const randomNum = Math.floor(Math.random() * 50) + 1;
      numbers.add(randomNum);
    }
    const matrixArray = Array.from(numbers);
    let matrixIndex = 0;
    for (let i = 0; i < matrix.rows.length; i++) {
      for (let j = 0; j < matrix.rows[i].cells.length; j++) {
        matrix.rows[i].cells[j].textContent = matrixArray[matrixIndex++];
      }
    }
  }
  
  function createMatrix() {
    const matrix = document.getElementById("matrix");
    for (let i = 0; i < 5; i++) {
      const row = matrix.insertRow(i);
      for (let j = 0; j < 5; j++) {
        const cell = row.insertCell(j);
      }
    }
  }
  
  createMatrix();
  