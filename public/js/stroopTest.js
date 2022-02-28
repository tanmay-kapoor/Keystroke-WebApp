const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    const token = localStorage.getItem("token");
    window.location = `/induce-stress?task=arithmetic&token=${token}`;
}

const startDiv = document.getElementsByClassName("start-div")[0];
let score = 0;
let duration;
const display = document.getElementById("timer");
const gameContent = [
    ...document.getElementsByClassName("game-content")[0].children,
];
const answerText = document.getElementById("answer-text");

const colors = ["red", "blue", "green", "orange", "purple", "brown"];
const allColors = [...colors, "black", "yellow", "pink", "white", "grey"];

const scoreText = document.getElementById("score");
const questionText = document.getElementById("question");
let recognition;

document.getElementById("start").addEventListener("click", (e) => {
    duration = 120;
    const endText = document.getElementById("end-text");
    if (endText) {
        endText.remove();
    }
    startDiv.style.display = "none";
    document.getElementsByClassName("game-content")[0].style.display = "block";
    document.getElementById("answer-text").innerText = "";
    gameContent.forEach((child) => (child.style.display = "block"));

    generateQuestion();
    startTimer();
});

function startTimer() {
    display.innerText = `Time Left : ${duration--} seconds`;

    const timerInterval = setInterval(() => {
        if (duration < 1) {
            recognition.stop();
            clearInterval(timerInterval);
            showOnlyScore();
            score = 0;
            startDiv.children[0].innerText = "Start Again";
            startDiv.style.display = "block";
        }

        display.innerText = `Time Left : ${duration--} seconds`;
    }, 1000);
}

function generateQuestion() {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();

    if (duration <= 0) {
        recognition.stop();
    }

    const textIndex = Math.floor(Math.random() * colors.length);
    let colorIndex = Math.floor(Math.random() * colors.length);
    while (colorIndex === textIndex) {
        colorIndex = Math.floor(Math.random() * colors.length);
    }
    scoreText.innerText = `Score : ${score}`;
    const text = colors[textIndex];
    questionText.innerText = `${
        text.charAt(0).toUpperCase() + text.substring(1)
    }`;
    questionText.style.color = colors[colorIndex];

    recognition.addEventListener("result", resultOfSpeechRecognition);
}

function resultOfSpeechRecognition(e) {
    const speech = e.results[e.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

    if (speech === questionText.style.color) {
        score++;
        answerText.innerText = "Correct!";
        generateQuestion();
    } else if (allColors.includes(speech)) {
        answerText.innerText = "Incorrect! (-10 secs)";
        duration -= 10;
        generateQuestion();
    }
}

function showOnlyScore() {
    gameContent.forEach((div) => {
        if (!div.classList.contains("score-div")) {
            div.style.display = "none";
        } else {
            const endText = document.createElement("h3");
            endText.setAttribute("id", "end-text");
            if (score < 75) {
                endText.innerText =
                    "Looks like you could not get 75 correct! Please try again.";
            } else {
                endText.innerText = "Task successfully completed!";
            }
            div.appendChild(endText);
        }
    });
}
