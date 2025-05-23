import { CreateQuiz } from './components/create.js';
import { Play } from './components/play.js';
import { Edit } from './components/edit.js';

export function Main() {
    const title = document.createElement('h1');
    title.innerText = 'Quiz Generator';
    title.className = 'title';

    const createButton = document.createElement('button');
    createButton.innerText = 'Create Quiz';
    createButton.className = 'button';
    createButton.setAttribute('aria-label', 'Create a new quiz');

    const playButton = document.createElement('button');
    playButton.innerText = 'Play Quiz';
    playButton.className = 'button';
    playButton.setAttribute('aria-label', 'Play an existing quiz');

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit Questions';
    editButton.className = 'button';
    editButton.setAttribute('aria-label', 'Edit existing questions');

    const container = document.createElement('div');
    container.className = 'container';
    container.appendChild(title);
    container.appendChild(createButton);
    container.appendChild(playButton);
    container.appendChild(editButton);

    createButton.addEventListener('click', () => {
        const main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(CreateQuiz());
    });

    playButton.addEventListener('click', () => {
        const main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(Play());
    });

    editButton.addEventListener('click', () => {
        const main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(Edit());
    });

    return container;
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    main.appendChild(Main());
});