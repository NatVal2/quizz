import {Main} from "../main.js";

export function Play (){
    const container = document.createElement('div');
    container.className = 'container';

    const name = document.createElement("h2");
    name.innerText = "Play Quiz";

    const backToButton = document.createElement('button');
    backToButton.className = 'back-button';
    backToButton.innerText = 'Back';


    backToButton.addEventListener('click', () => {
        const main = document.getElementById('main');
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
        main.appendChild(Main());
    });
    const header = document.createElement('div');
    header.className = 'header';

    header.appendChild(name);
    header.appendChild(backToButton);

    const progress = document.createElement('div');
    progress.className = 'quiz-progress';
    progress.textContent = 'Question 1 von 10';

    const main = document.createElement('div');
    main.className = 'quiz-main';

    const questionCard = document.createElement('div');
    questionCard.className = 'quiz-question-card';
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const questionText = document.createElement('h2');
    questionText.className = 'quiz-question';
    questionText.textContent = `Question`

    const answersContainer = document.createElement('div');
    answersContainer.className = 'quiz-answers';


    for (let i = 0; i < 4; i++) {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'quiz-answer-btn';
        answerBtn.textContent = `Answer ${i+1}`;
        answerBtn.dataset.index = i.toString();
        answersContainer.appendChild(answerBtn);
    }

    const submitBtn = document.createElement('button');
    submitBtn.className = 'quiz-submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.disabled = true;

    questionCard.appendChild(questionText);
    questionCard.appendChild(answersContainer);
    questionCard.appendChild(submitBtn);
    main.appendChild(questionCard);


    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback hidden';

    const feedbackText = document.createElement('p');
    feedbackText.className = 'feedback-text';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    nextBtn.textContent = 'Continue...';

    feedback.appendChild(feedbackText);
    feedback.appendChild(nextBtn);
    main.appendChild(feedback);

    const results = document.createElement('div');
    results.className = 'quiz-results hidden';

    const resultsTitle = document.createElement('h2');
    resultsTitle.textContent = 'Quiz is over!';

    const resultsStats = document.createElement('p');
    resultsStats.className = 'quiz-stats';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'quiz-restart-btn';
    restartBtn.textContent = 'Play again';

    const homeBtn = document.createElement('button');
    homeBtn.className = 'quiz-home-btn';
    homeBtn.textContent = 'Back home';

    results.appendChild(resultsTitle);
    results.appendChild(resultsStats);
    results.appendChild(restartBtn);
    results.appendChild(homeBtn);

    container.appendChild(header)
    container.appendChild(progress)
    container.appendChild(main);
    container.appendChild(results);


    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;

    //const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const totalQuestions = Math.min(quizzes.length, 10); // Max 10 Fragen


    function initQuiz() {

        if (totalQuestions === 0) {
            questionText.textContent = 'No question!';
            answersContainer.innerHTML = '';
            return;
        }
        loadQuestion(0)
        progress.textContent = `Question 1 from ${totalQuestions}`;

    }


    function loadQuestion(index) {
        const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        if (index >= totalQuestions) {
            showResults();
            return;
        }

        const quiz = quizzes[index];
        questionText.textContent = quiz.question;

        const answerBtns = answersContainer.querySelectorAll('.quiz-answer-btn');
        quiz.answers.forEach((answer, i) => {
            answerBtns[i].textContent = answer;
        });

        // Reset
        answerBtns.forEach(btn => {
            btn.classList.remove('selected');
            btn.disabled = false;
        });
        submitBtn.disabled = true;
        feedback.classList.add('hidden');
        selectedAnswer = null;
    }


    answersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quiz-answer-btn')) {
            const answerBtns = answersContainer.querySelectorAll('.quiz-answer-btn');
            answerBtns.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
            submitBtn.disabled = false;
            selectedAnswer = parseInt(e.target.dataset.index);
        }
    });


    submitBtn.addEventListener('click', () => {
        if (selectedAnswer === null) return;

        const quiz = quizzes[currentQuestion];
        const answerBtns = answersContainer.querySelectorAll('.quiz-answer-btn');
        const isCorrect = quiz.answers[selectedAnswer] === quiz.correct;

        // deaktivieren
        answerBtns.forEach(btn => btn.disabled = true);

        // Feedback
        feedback.classList.remove('hidden');
        if (isCorrect) {
            feedbackText.textContent = 'Right!';
            feedbackText.style.color = 'green';
            score++;
        } else {
            feedbackText.textContent = `False! The right Answer is: ${quiz.correct}`;
            feedbackText.style.color = 'red';
        }
    });

    // Nächste Frage
    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
            loadQuestion(currentQuestion);
            progress.textContent = `Question ${currentQuestion + 1} from ${totalQuestions}`;
        } else {
            showResults();
        }
    });

    // Ergebnisse anzeigen
    function showResults() {
        main.classList.add('hidden');
        results.classList.remove('hidden');
        const percentage = Math.round((score / totalQuestions) * 100);
        resultsStats.textContent = `${score}/${totalQuestions} right, ${percentage}%`;
    }


    restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        main.classList.remove('hidden');
        results.classList.add('hidden');
        initQuiz();
    });

    homeBtn.addEventListener('click', () => {
        const main = document.getElementById('main');
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
        main.appendChild(Main());
    });

    return container
}