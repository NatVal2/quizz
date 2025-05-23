import { Main } from "../main.js";
import {navigateToMain,showAllQuizzesPreview, createDeleteHandler } from "./utils.js";

export function Edit() {
    const editContainer = document.createElement('div');
    editContainer.className = 'container';

    const editName = document.createElement("h2");
    editName.innerText = "Edit Quiz";

    const backButton = document.createElement('button');
    backButton.ButtonclassName = 'back-button';
    backButton.innerText = 'Back';

    backButton.addEventListener('click', () => {
      navigateToMain()
    });

    const header = document.createElement('div');
    header.className = 'header';
    header.appendChild(editName);
    header.appendChild(backButton);

    const preview = document.createElement('div');
    preview.className = 'quiz-items';

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'DELETE ALL';
    deleteButton.className = 'button delete-all';

    // Load quizzes from localStorage
    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    function renderQuizzes() {
        showAllQuizzesPreview(quizzes, preview, {
            onDelete: createDeleteHandler(quizzes, preview, {
                onEdit: showEditForm
            }),
            onEdit: showEditForm
        });
        // Add event listeners
        preview.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                deleteQuiz(index);
            });
        });

        preview.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                showEditForm(index);
            });
        });
    }

    function showEditForm(index) {
        const quiz = quizzes[index];
        const quizPreview = preview.querySelector(`.quiz-preview[data-index="${index}"]`);

        if (!quizPreview) return;

        quizPreview.innerHTML = `
            <div class="edit-form">
                <label>Question:</label>
                <input type="text" class="edit-question" value="${quiz.question}">
                
                ${quiz.answers.map((answer, i) => `
                    <div class="answer-row">
                        <label>${String.fromCharCode(65 + i)}:</label>
                        <input type="text" class="edit-answer" value="${answer}">
                        <input type="radio" name="correct-answer" ${answer === quiz.correct ? 'checked' : ''} value="${i}">
                    </div>
                `).join('')}
                
                <div class="edit-buttons">
                    <button class="save-edit" data-index="${index}">Save</button>
                    <button class="cancel-edit">Cancel</button>
                </div>
            </div>
        `;

        // Add event listeners for edit form
        quizPreview.querySelector('.save-edit').addEventListener('click', () => {
            saveEditedQuiz(index);
        });

        quizPreview.querySelector('.cancel-edit').addEventListener('click', () => {
            renderQuizzes();
        });
    }

    function saveEditedQuiz(index) {
        const editForm = preview.querySelector(`.quiz-preview[data-index="${index}"] .edit-form`);
        if (!editForm) return;

        const question = editForm.querySelector('.edit-question').value;
        const answerInputs = editForm.querySelectorAll('.edit-answer');
        const answers = Array.from(answerInputs).map(input => input.value);
        const correctIndex = parseInt(editForm.querySelector('input[name="correct-answer"]:checked').value);
        const correct = answers[correctIndex];

        // Validate inputs
        if (!question || answers.some(answer => !answer) || !correct) {
            alert('Please fill all fields and select a correct answer!');
            return;
        }

        // Update quiz
        quizzes[index] = { question, answers, correct };
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        renderQuizzes();
    }

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all quizzes?')) {
            localStorage.removeItem('quizzes');
            quizzes = [];
            renderQuizzes();
        }
    });

    // Initial render
    renderQuizzes();

    editContainer.appendChild(header);
    editContainer.appendChild(preview);
    editContainer.appendChild(deleteButton);

    return editContainer;
}