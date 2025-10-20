const quizData = [
  { type: "single", question: "What is the capital of France?", options: ["Paris","London","Berlin","Madrid"], answer: "Paris" },
  { type: "multi", question: "Select the prime numbers:", options: ["2","3","4","5"], answer: ["2","3","5"] },
  { type: "single", question: "Which planet is known as the Red Planet?", options: ["Earth","Mars","Jupiter","Saturn"], answer: "Mars" },
  { type: "fill", question: "Fill in the blank: The chemical symbol for water is ____.", answer: "H2O" },
  { type: "single", question: "Who wrote 'Romeo and Juliet'?", options: ["William Wordsworth","William Shakespeare","Jane Austen","Mark Twain"], answer: "William Shakespeare" },
  { type: "multi", question: "Select all programming languages:", options: ["Python","HTML","JavaScript","CSS"], answer: ["Python","JavaScript"] },
  { type: "single", question: "What is 9 × 9?", options: ["81","72","99","90"], answer: "81" },
  { type: "fill", question: "Fill in the blank: The largest ocean on Earth is the ____ Ocean.", answer: "Pacific" },
  { type: "single", question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], answer: "Carbon Dioxide" },
  { type: "multi", question: "Select the colors in the rainbow:", options: ["Red","Pink","Blue","Cyan","Green","Yellow"], answer: ["Red","Blue","Green","Yellow"] }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 20;

const quiz = document.getElementById("quiz");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const questionNumberDisplay = document.getElementById("questionNumber");

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 20;
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;

  const q = quizData[currentQuestion];
  questionNumberDisplay.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;

  let html = `<div class="question">${q.question}</div><div class="options">`;

  if(q.type === "single") {
    q.options.forEach(option => {
      html += `<label><input type="radio" name="option" value="${option}"> ${option}</label>`;
    });
  } else if(q.type === "multi") {
    q.options.forEach(option => {
      html += `<label><input type="checkbox" name="option" value="${option}"> ${option}</label>`;
    });
  } else if(q.type === "fill") {
    html += `<input type="text" id="fillAnswer" placeholder="Type your answer here">`;
  }

  html += `</div>`;
  quiz.innerHTML = html;

  if(currentQuestion === quizData.length - 1) nextBtn.textContent = "Submit";

  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if(timeLeft <= 0) {
      clearInterval(timer);
      showCorrectAnswer(true);
    }
  }, 1000);
}

function checkAnswer() {
  const q = quizData[currentQuestion];
  let userAnswer;

  if(q.type === "single") {
    const selected = document.querySelector('input[name="option"]:checked');
    if(selected) userAnswer = selected.value;
  } else if(q.type === "multi") {
    const selected = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(el => el.value);
    if(selected.length > 0) userAnswer = selected;
  } else if(q.type === "fill") {
    const val = document.getElementById("fillAnswer").value.trim();
    if(val !== "") userAnswer = val;
  }

  return userAnswer;
}

function showCorrectAnswer(timeout=false) {
  clearInterval(timer);
  const q = quizData[currentQuestion];
  const userAnswer = checkAnswer();
  const optionLabels = document.querySelectorAll(".options label");

  if(!userAnswer && !timeout) {
    alert("Please select or type an answer before proceeding!");
    return false; // Prevent moving next
  }

  if(q.type === "single" || q.type === "multi") {
    optionLabels.forEach(label => {
      const val = label.querySelector("input").value;
      if(q.type === "single") {
        if(val === q.answer) label.classList.add("correct");
        if(userAnswer && val === userAnswer && val !== q.answer) label.classList.add("wrong");
      } else if(q.type === "multi") {
        if(q.answer.includes(val)) label.classList.add("correct");
        if(userAnswer && userAnswer.includes(val) && !q.answer.includes(val)) label.classList.add("wrong");
      }
    });
  } else if(q.type === "fill") {
    const input = document.getElementById("fillAnswer");
    if(userAnswer && userAnswer.toLowerCase() === q.answer.toLowerCase()) {
      input.style.backgroundColor = "#a0e7a0";
      score++;
    } else {
      input.style.backgroundColor = "#f78c8c";
      input.value = q.answer;
    }
  }

  if(userAnswer) {
    if(q.type === "single" && userAnswer === q.answer) score++;
    if(q.type === "multi" && JSON.stringify(userAnswer.sort()) === JSON.stringify(q.answer.sort())) score++;
  }

  return true;
}

nextBtn.addEventListener("click", () => {
  const canProceed = showCorrectAnswer();
  if(!canProceed) return;

  setTimeout(() => {
    currentQuestion++;
    if(currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      quiz.innerHTML = `<h2>You scored ${score} out of ${quizData.length}</h2>`;
      nextBtn.style.display = "none";
      timerDisplay.style.display = "none";
      questionNumberDisplay.style.display = "none";
    }
  }, 1500); // Show correct answers for 1.5s
});

loadQuestion();
