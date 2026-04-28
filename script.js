const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const slider = document.getElementById("angleSlider");
const angleText = document.getElementById("angleValue");
const values = document.getElementById("values");

let score = 0;
let correctAnswer = 0;
let timeLeft = 10;
let timerInterval;

// HIGH SCORE
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = "High Score: " + highScore;

// TRIANGLE
function drawTriangle(angleDeg) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let angle = angleDeg * Math.PI / 180;
  let base = 150;
  let height = Math.tan(angle) * base;

  let x1 = 50, y1 = 150;
  let x2 = x1 + base, y2 = y1;
  let x3 = x2, y3 = y2 - height;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.stroke();

  let hyp = Math.sqrt(base * base + height * height);

  let sin = (height / hyp).toFixed(2);
  let cos = (base / hyp).toFixed(2);
  let tan = (height / base).toFixed(2);

  values.innerHTML = `
  sin θ = ${sin} <br>
  cos θ = ${cos} <br>
  tan θ = ${tan}
  `;
}

drawTriangle(slider.value);

slider.addEventListener("input", () => {
  angleText.innerText = slider.value;
  drawTriangle(slider.value);
});

// GAME
function startGame() {
  clearInterval(timerInterval);
  timeLeft = 10;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("result").innerText = "⏰ Time Up!";
    }
  }, 1000);

  let angle = Math.floor(Math.random() * 60) + 10;

  document.getElementById("question").innerText =
    "Find sin " + angle + "°";

  let rad = angle * Math.PI / 180;
  correctAnswer = Math.sin(rad).toFixed(2);

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  let options = [correctAnswer];

  while (options.length < 4) {
    let fake = (Math.random()).toFixed(2);
    if (!options.includes(fake)) {
      options.push(fake);
    }
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(opt => {
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  clearInterval(timerInterval);

  if (selected == correctAnswer) {
    score++;
    document.getElementById("result").innerText = "✅ Correct!";
  } else {
    document.getElementById("result").innerText =
      "❌ Wrong! Correct = " + correctAnswer;
  }

  document.getElementById("score").innerText = "Score: " + score;

  // HIGH SCORE UPDATE
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").innerText =
      "High Score: " + highScore;
  }
}