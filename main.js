import {CreateQuiz} from "./components/create.js";
import {Play} from "./components/play.js";
import {Edit} from "./components/edit.js";


export function Main() {
    const title = document.createElement('h1')
    title.innerText = 'QUIZ-GENERATOR'
    title.className = "title"
    const createButton = document.createElement("button")
    createButton.innerText = "CREATE QUIZ"
    createButton.className = "button"
    const playButton = document.createElement("button")
    playButton.innerText = "PLAY QUIZ"
    playButton.className = "button"
    const editButton = document.createElement("button")
    editButton.innerText = "EDIT QUESTIONS"
    editButton.className = "button"


    const container = document.createElement('div');
    container.appendChild(title);
    container.appendChild(createButton);
    container.appendChild(playButton);
    container.appendChild(editButton);
    container.className = "container"


    createButton.addEventListener("click", ()=>{
        const main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(CreateQuiz());
    })

    playButton.addEventListener("click", ()=>{
        const main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(Play());
    })

    editButton.addEventListener("click", ()=>{
        const main = document.getElementById('main');
        main.innerHTML = '';
        main.appendChild(Edit());
    })


    return container;
}

const main = document.getElementById('main');
main.appendChild(Main());