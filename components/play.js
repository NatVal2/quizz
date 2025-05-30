import { navigateToMain, sanitizeInput } from './utils.js';
import { CreateQuiz } from './create.js';

export function Play() {
    const container = document.createElement('div');
    container.className = 'container';

    const name = document.createElement('h2');
    name.innerText = 'Play Quiz';

    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerText = 'Back';
    backButton.addEventListener('click', navigateToMain);

    const header = document.createElement('div');
    header.className = 'header';
    header.appendChild(name);
    header.appendChild(backButton);

    const progress = document.createElement('div');
    progress.className = 'quiz-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progress.appendChild(progressBar);

    const main = document.createElement('div');
    main.className = 'quiz-main';

    const questionCard = document.createElement('div');
    questionCard.className = 'quiz-question-card';
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const questionText = document.createElement('h2');
    questionText.className = 'quiz-question';
    questionText.textContent = 'Question';

    const answersContainer = document.createElement('div');
    answersContainer.className = 'quiz-answers';

    const ANSWER_COUNT = 4;
    for (let i = 0; i < ANSWER_COUNT; i++) {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'quiz-answer-btn';
        answerBtn.textContent = `Answer ${i + 1}`;
        answerBtn.dataset.index = i.toString();
        answerBtn.setAttribute('aria-label', `Answer option ${i + 1}`);
        answersContainer.appendChild(answerBtn);
    }

    const submitBtn = document.createElement('button');
    submitBtn.className = 'quiz-submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-label', 'Submit selected answer');

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
    homeBtn.textContent = 'Back';
    homeBtn.addEventListener('click', navigateToMain);

    results.appendChild(resultsTitle);
    results.appendChild(resultsStats);
    results.appendChild(restartBtn);
    results.appendChild(homeBtn);
    container.appendChild(header);
    container.appendChild(progress);
    container.appendChild(main);
    container.appendChild(results);

    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;
    const MAX_QUESTIONS = 10;
    const totalQuestions = Math.min(quizzes.length, MAX_QUESTIONS);

    function initQuiz() {
        if (totalQuestions === 0) {
            questionText.textContent = 'No questions available!';
            answersContainer.innerHTML = '';
            const createBtn = document.createElement('button');
            createBtn.textContent = 'Create a Quiz';
            createBtn.className = 'button';
            createBtn.addEventListener('click', () => {
                const main = document.getElementById('main');
                main.innerHTML = '';
                main.appendChild(CreateQuiz());
            });
            questionCard.appendChild(createBtn);
            return;
        }
        loadQuestion(0);
        updateProgress();
    }
    let timeLeft = 30;
    let timer;
    const timerBar = document.createElement('div');
    timerBar.className = 'timer-bar';
    questionCard.appendChild(timerBar);

    function startTimer() {
        timeLeft = 20;
        timerBar.style.setProperty('--timer-width', '100%');
        timer = setInterval(() => {
            timeLeft--;
            timerBar.style.setProperty('--timer-width', `${(timeLeft / 20) * 100}%`);
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackText.textContent = `Time's up! The right answer is: ${sanitizeInput(quiz.correct)}`;
                feedbackText.style.color = '#EF4444';
                feedback.classList.remove('hidden');
                answersContainer.querySelectorAll('.quiz-answer-btn').forEach(btn => btn.disabled = true);
            }
        }, 1000);
    }
    function loadQuestion(index) {
        clearInterval(timer);
        startTimer();
        const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        if (index >= totalQuestions) {
            showResults();
            return;
        }
        const quiz = quizzes[index];
        questionText.textContent = sanitizeInput(quiz.question);
        const shuffledAnswers = [...quiz.answers].sort(() => Math.random() - 0.5);
        const answerBtns = answersContainer.querySelectorAll('.quiz-answer-btn');
        shuffledAnswers.forEach((answer, i) => {
            answerBtns[i].textContent = sanitizeInput(answer);
            answerBtns[i].dataset.correct = answer === quiz.correct;
        });
        answerBtns.forEach(btn => {
            btn.classList.remove('selected');
            btn.disabled = false;
        });
        submitBtn.disabled = true;
        feedback.classList.add('hidden');
        selectedAnswer = null;
        updateProgress();
    }

    function updateProgress() {
        progress.textContent = `Question ${currentQuestion + 1} from ${totalQuestions}`;
        progressBar.style.width = `${((currentQuestion + 1) / totalQuestions) * 100}%`;
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

    answersContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !submitBtn.disabled) {
            submitBtn.click();
        }
    });

    submitBtn.addEventListener('click', () => {
        if (selectedAnswer === null) return;
        const quiz = quizzes[currentQuestion];
        const answerBtns = answersContainer.querySelectorAll('.quiz-answer-btn');
        const isCorrect = answerBtns[selectedAnswer].dataset.correct === 'true';
        answerBtns.forEach(btn => btn.disabled = true);
        feedback.classList.remove('hidden');
        if (isCorrect) {
            feedbackText.textContent = 'Right!';
            feedbackText.style.color = 'green';
            score++;
        } else {
            feedbackText.textContent = `False! The right Answer is: ${sanitizeInput(quiz.correct)}`;
            feedbackText.style.color = 'red';
        }
    });

    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
            loadQuestion(currentQuestion);
        } else {
            showResults();
        }
    });

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

    initQuiz();
    return container;
}