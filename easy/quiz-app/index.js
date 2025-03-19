import { quizData } from "./data.js";

let index = 0;
let score = 0;
const questions = document.getElementById("question-text");
const options = document.getElementById("options-container");
const submit = document.getElementById("submit-btn");

submit.addEventListener("click", () => {
    if (submit.textContent === "Let's Start") {
        submit.textContent = "Submit"; // Change button text
        submit.style.backgroundColor = "#2e86de"; // Change to blue
        loadQuestion(index); // Start quiz
        setTimer();
        submit.disabled = true; // Keep disabled until an answer is selected
    } else {
        checkAnswer(); // Check answer and move to next question
    }
});

let timerInterval; 

function setTimer() {
    let timeLeft = 5; // Set countdown to 5 seconds

    document.getElementById("countdown").textContent = timeLeft; // Show initial time

    timerInterval = setInterval(() => {
        timeLeft--; // Decrease time

        if (timeLeft >= 0) {
            document.getElementById("countdown").textContent = timeLeft; // Update UI
        }

        if (timeLeft === 0) { 
            clearInterval(timerInterval); // Stop the timer
            autoCheckAnswer(); // Auto-submit the question if time runs out
        }
    }, 1000);
}

function autoCheckAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (!selectedOption) {
        // No answer selected → Move to next question
        questions.textContent = `Time's up! The correct answer was: ${quizData[index][quizData[index].correct]}`; // since we have stored correct option as a,b,c or d 
        // we need to acess the value of respective option 
        /*  "question": "Which language runs in a web browser?",
        "a": "Java",
        "b": "C",
        "c": "Python",
        "d": "JavaScript",
        "correct": "d"

        so to access correct answer - javascript stored in d, we run quizData[index][quizData[index].correct
        
        */
    }

    submit.disabled = true; // Temporarily disable submit button

    setTimeout(() => {
        index++; // Move to next question

        if (index < quizData.length) {
            loadQuestion(index); // Load next question
            submit.disabled = true; // Disable submit button until an answer is selected
        } else {
            showFinalScore(); // Show final score
        }
    }, 1500);
}


    
    


function loadQuestion(index) {

    clearInterval(timerInterval); // Stop any previous timer
    


    setTimer(); // when quiz starts begin timer
    const currentQuestion = quizData[index];

    /* const currentQuestion = {
    "question": "Which language runs in a web browser?",
    "a": "Java",
    "b": "C",
    "c": "Python",
    "d": "JavaScript",
    "correct": "d"
};
 */
    questions.textContent = currentQuestion.question;
    options.innerHTML = ""; // Clear previous options

    const answerKeys = Object.keys(currentQuestion).filter(key => key !== "question" && key !== "correct");

    answerKeys.forEach(key => {
        const radiobtn = document.createElement("input");
        radiobtn.type = "radio";
        radiobtn.name = "answer";
        radiobtn.value = key;

        /* we do this above 
         <input type="radio" name="answer" value="a">
<input type="radio" name="answer" value="b">
<input type="radio" name="answer" value="c">
<input type="radio" name="answer" value="d">
 */

        const label = document.createElement("label");
        label.textContent = currentQuestion[key];
        label.prepend(radiobtn);

        /* label.textContent = currentQuestion[key]

currentQuestion["a"] → "Java"
currentQuestion["b"] → "C"
currentQuestion["c"] → "Python"
currentQuestion["d"] → "JavaScript"
So label.textContent becomes:

"Java"
"C"
"Python"
"JavaScript" */

        options.appendChild(label);
        options.appendChild(document.createElement("br"));

        radiobtn.addEventListener("change", () => {
            clearInterval(timerInterval); // Stop timer when an option is selected
            submit.disabled = false; // Enable submit button when user selects an option
        });
    });
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    // :checked → Filters the one that is selected.

    if (!selectedOption) return; // Prevent proceeding if no answer is selected

    const userAnswer = selectedOption.value;
    const correctAnswer = quizData[index].correct;

    if (userAnswer === correctAnswer) {
        score++;
        questions.textContent = "Correct!";
    } else {
        questions.textContent = `Wrong! The correct answer was: ${quizData[index][correctAnswer]}`;
    }

    submit.disabled = true; // Temporarily disable button
    setTimeout(() => {
        index++;
        if (index < quizData.length) {
            loadQuestion(index); // Load next question
            submit.disabled = true; // Disable until next answer is selected
        } else {
            showFinalScore(); // Show result
        }
    }, 1500); // Delay for 1.5 sec before moving to the next question
}

function showFinalScore() {
    questions.textContent = `Quiz Completed! Your Score: ${score} / ${quizData.length}`;
    options.innerHTML = "";
    submit.textContent = "Restart Quiz";
    submit.style.backgroundColor = "green"; // Reset to green
    submit.disabled = false;

    submit.addEventListener("click", () => {
        index = 0;
        score = 0;
        submit.textContent = "Submit";
        submit.style.backgroundColor = "#2e86de"; // Reset to blue
        loadQuestion(index);
        submit.disabled = true;
    });
}
