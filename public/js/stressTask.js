const startDiv = document.getElementsByClassName("start-div")[0];
let score = 0;
let duration;
const operators = ["+", "-", "*"];
const display = document.getElementById("timer");
const gameContent = [
    ...document.getElementsByClassName("game-content")[0].children,
];
const answerText = document.getElementById("answer-text");

document.getElementById("start").addEventListener("click", (e) => {
    duration = 60 * 2;
    const endText = document.getElementById("end-text");
    if (endText) {
        endText.remove();
    }
    startDiv.style.display = "none";
    document.getElementsByClassName("game-content")[0].style.display = "block";
    gameContent.forEach((child) => (child.style.display = "block"));

    generateQuestion();
    startTimer();
});

function startTimer() {
    display.innerText = `Time Left : ${duration} seconds`;

    const timerInterval = setInterval(() => {
        if (--duration < 1) {
            clearInterval(timerInterval);
            showOnlyScore();
            score = 0;
            startDiv.children[0].innerText = "Start Again";
            startDiv.style.display = "block";
        }

        display.innerText = `Time Left : ${duration} seconds`;
    }, 1000);
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 21);
    const num2 = Math.floor(Math.random() * 21);
    const operator = Math.floor(Math.random() * 3);
    document.getElementById("score").innerText = `Score : ${score}`;
    document.getElementById(
        "question"
    ).innerText = `${num1} ${operators[operator]} ${num2} = ?`;

    let correctAnswer;
    if (operator == 0) {
        correctAnswer = num1 + num2;
    } else if (operator == 1) {
        correctAnswer = num1 - num2;
    } else {
        correctAnswer = num1 * num2;
    }

    generateOptions(correctAnswer);
}

function generateOptions(correctAnswer) {
    const answersDiv =
        document.getElementsByClassName("answers-div")[0].children;
    const correctAnswerIndex = Math.floor(Math.random() * answersDiv.length);

    for (let i = 0; i < answersDiv.length; i++) {
        const button = document.getElementById(`option${i + 1}`);
        button.removeEventListener("click", handleIncorrectAnswer);
        button.removeEventListener("click", handleCorrectAnswer);

        if (i !== correctAnswerIndex) {
            button.innerText =
                Math.floor(Math.random() * 401) * getSign(correctAnswer);
            button.addEventListener("click", handleIncorrectAnswer);
        } else {
            button.innerText = correctAnswer;
            button.addEventListener("click", handleCorrectAnswer);
        }
    }
}

function handleIncorrectAnswer() {
    duration -= 10;
    answerText.innerText = "Incorrect! (-10 secs)";
    generateQuestion();
}

function handleCorrectAnswer() {
    score++;
    answerText.innerText = "Correct!";
    generateQuestion();
}

function getSign(correctAnswer) {
    return correctAnswer < 0 ? -1 : 1;
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
