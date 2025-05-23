import {navigateToMain,  showAllQuizzesPreview, createDeleteHandler} from "./utils.js";


export function CreateQuiz() {
    const container = document.createElement('div');
    container.className = 'container';

    const name = document.createElement("h2");
    name.innerText = "Create Quiz";

    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerText = 'Back';

    backButton.addEventListener('click', () => {
        navigateToMain()
    });

    const header = document.createElement('div');
    header.className = 'header';

    header.appendChild(name);
    header.appendChild(backButton);

    const form = document.createElement('form');
    form.className = 'create-form';

    const label = document.createElement('label');
    label.innerText = 'CREATE QUIZ';
    label.setAttribute('for', 'question');

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.id = 'quiz';
    questionInput.name = 'quiz';
    questionInput.className = "input";

    form.appendChild(label);
    form.appendChild(questionInput);

    const options = ['A', 'B', 'C', 'D'];

    options.forEach((text, index) => {
        const optionsWrapper = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = text;
        radio.id = `options-${index}`;
        const radioLabel = document.createElement('label');
        radioLabel.setAttribute('for', `options-${index}`);
        radioLabel.innerText = text;

        const answerInput = document.createElement('input');
        answerInput.className = 'text-input';
        answerInput.type = 'text';
        answerInput.id = `options-text-${index}`;
        answerInput.placeholder = `Answer ${String.fromCharCode(65 + index)}`;

        optionsWrapper.appendChild(radio);
        optionsWrapper.appendChild(answerInput);
        optionsWrapper.appendChild(radioLabel);

        form.appendChild(optionsWrapper);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.innerText = 'CREATE';
    button.className = "button";

    const preview = document.createElement('div');
    preview.className = 'preview'

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let answers = [];
        let correctAnswer = '';
        const quizQuestion = questionInput.value;

        const answerInputs = form.querySelectorAll('input[type="text"].text-input');
        const radios = form.querySelectorAll('input[type="radio"]');

        answerInputs.forEach((input) => {
            answers.push(input.value);
        });

        radios.forEach((radio, index) => {
            if (radio.checked) {
                correctAnswer = answers[index];
            }
        });

        if (!quizQuestion || answers.some(answer => !answer) || !correctAnswer) {
            alert('All fields are required!');
            return;
        }

        const quiz = {
            question: quizQuestion,
            answers: answers,
            correct: correctAnswer
        };

        let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        quizzes.push(quiz);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));

        showAllQuizzesPreview(quizzes, preview, {
            onDelete: createDeleteHandler(quizzes,preview)
        });

        form.reset();
    });

    form.appendChild(button);
    form.appendChild(preview);

    container.appendChild(header);
    container.appendChild(form);

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    showAllQuizzesPreview(quizzes, preview, {onDelete: createDeleteHandler(quizzes,preview)} );
    return container;
}

