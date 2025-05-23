import {Main} from "../main.js"

/**
 *
 * @param {Array} quizzes - Array mit Quizdaten
 * @param {HTMLElement} container - Zielcontainer
 * @param {Object} options - { onDelete: Function, onEdit: Function }
 */
export function navigateToMain() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    main.appendChild(Main());
}

export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

export function createDeleteHandler(quizzes, preview) {
    return function deleteQuiz(index) {
        quizzes.splice(index, 1);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        showAllQuizzesPreview(quizzes, preview, {
            onDelete: createDeleteHandler(quizzes, preview)
        });
    };
}

export function showAllQuizzesPreview(quizzes, preview, options = {}) {
    const {onDelete, onEdit} = options

    // Container leeren
    preview.innerHTML = '';

    // Titel erstellen
    const title = document.createElement('h3');
    title.textContent = 'All Cards';
    preview.appendChild(title);

    // Für jede Quizfrage ein DOM-Element erstellen
    quizzes.forEach((quiz, quizIndex) => {
        const quizDiv = document.createElement('div');
        quizDiv.className = 'quiz-preview';
        quizDiv.dataset.index = quizIndex;

        // Frage mit Nummerierung
        const questionText = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `Question ${quizIndex + 1}: `;
        questionText.appendChild(strong);
        questionText.appendChild(document.createTextNode(sanitizeInput(quiz.question)));
        quizDiv.appendChild(questionText);

        // Antworten als Liste
        const ul = document.createElement('ul');
        quiz.answers.forEach((ans, i) => {
            const li = document.createElement('li');
            li.textContent = `${String.fromCharCode(65 + i)}: ${sanitizeInput(ans)}`;
            if (ans === quiz.correct) {
                const strong = document.createElement('strong');
                strong.textContent = ' (Right)';
                li.appendChild(strong);
            }
            ul.appendChild(li);
        });
        quizDiv.appendChild(ul);
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'quiz-actions';

        if (onDelete) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.dataset.index = quizIndex;
            deleteButton.type = 'button';
            deleteButton.addEventListener('click', () => onDelete(quizIndex));
            quizDiv.appendChild(deleteButton);
        }

        if (onEdit) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.dataset.index = quizIndex;
            editBtn.addEventListener('click', () => onEdit(quizIndex));
            quizDiv.appendChild(editBtn);
        }
        preview.appendChild(quizDiv);
        quizDiv.appendChild(buttonsDiv);
    });
}

export function showEditForm(index, quizzes, preview, renderCallback) {
    const quiz = quizzes[index];
    const quizPreview = preview.querySelector(`.quiz-preview[data-index="${index}"]`);
    if (!quizPreview) return;

    quizPreview.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    fragment.appendChild(editForm);

    const questionLabel = document.createElement('label');
    questionLabel.textContent = 'Question:';
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.className = 'edit-question';
    questionInput.value = quiz.question;
    editForm.appendChild(questionLabel);
    editForm.appendChild(questionInput);

    quiz.answers.forEach((answer, i) => {
        const answerRow = document.createElement('div');
        answerRow.className = 'answer-row';
        const answerLabel = document.createElement('label');
        answerLabel.textContent = `${String.fromCharCode(65 + i)}:`;
        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.className = 'edit-answer';
        answerInput.value = answer;
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'correct-answer';
        radioInput.value = i;
        radioInput.checked = answer === quiz.correct;
        answerRow.appendChild(answerLabel);
        answerRow.appendChild(answerInput);
        answerRow.appendChild(radioInput);
        editForm.appendChild(answerRow);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'edit-buttons';
    const saveButton = document.createElement('button');
    saveButton.className = 'save-edit';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        saveEditedQuiz(index, quizzes, preview, renderCallback);
    });

    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-edit';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', renderCallback);

    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(cancelButton);
    editForm.appendChild(buttonsDiv);
    quizPreview.appendChild(fragment);
}

export function saveEditedQuiz(index, quizzes, preview, renderCallback) {
    const editForm = preview.querySelector(`.quiz-preview[data-index="${index}"] .edit-form`);
    if (!editForm) return;

    const question = editForm.querySelector('.edit-question').value;
    const answerInputs = editForm.querySelectorAll('.edit-answer');
    const answers = Array.from(answerInputs).map(input => input.value);
    const correctIndex = parseInt(editForm.querySelector('input[name="correct-answer"]:checked')?.value);
    const correct = answers[correctIndex];

    if (!question || answers.some(answer => !answer) || isNaN(correctIndex)) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = 'Please fill all fields and select a correct answer!';
        editForm.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
        return;
    }

    quizzes[index] = { question, answers, correct };
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    renderCallback();
}