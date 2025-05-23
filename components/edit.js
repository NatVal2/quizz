import { navigateToMain, showAllQuizzesPreview, createDeleteHandler, showEditForm } from './utils.js';

export function Edit() {
    const editContainer = document.createElement('div');
    editContainer.className = 'container';

    const editName = document.createElement('h2');
    editName.innerText = 'Edit Quiz';

    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerText = 'Back';
    backButton.addEventListener('click', navigateToMain);

    const header = document.createElement('div');
    header.className = 'header';
    header.appendChild(editName);
    header.appendChild(backButton);

    const preview = document.createElement('div');
    preview.className = 'quiz-items';

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete All';
    deleteButton.className = 'button delete-all';

    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    function renderQuizzes() {
        showAllQuizzesPreview(quizzes, preview, {
            onDelete: createDeleteHandler(quizzes, preview, { onEdit: (index) => showEditForm(index, quizzes, preview, renderQuizzes) }),
            onEdit: (index) => showEditForm(index, quizzes, preview, renderQuizzes)
        });
    }

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all quizzes?')) {
            localStorage.removeItem('quizzes');
            quizzes = [];
            renderQuizzes();
        }
    });

    renderQuizzes();

    editContainer.appendChild(header);
    editContainer.appendChild(preview);
    editContainer.appendChild(deleteButton);

    return editContainer;
}