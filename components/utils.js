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

// sanitizeInput auslagern
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