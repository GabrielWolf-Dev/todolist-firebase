import { getAuth, signOut } from "firebase/auth";
import {
    getFirestore, 
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc
} from "firebase/firestore";
import { checkTextTodo } from '../../scripts/validate';

import './style.css';

export default function Todo(user = null){
    const auth = getAuth();
    const db = getFirestore();

    let loginPage;
    let todoPage;
    
    window.todoPage = {
        loggout: () => {
            loginPage = document.querySelector('.login');
            todoPage = document.querySelector('.todo-box');
        
            signOut(auth).then(() => {
                hideTodoPage();
            }).catch((error) => {
              console.error(error);
            });
        },
        setTodo: event => {
            event.preventDefault();

            const form = event.target;
            const inputs = new FormData(form);
            const todoText = inputs.get('todo');
            const deadline = inputs.get('datetime');
            console.log(form[1]);

            if(checkTextTodo(todoText, form[1])){
                const objDatas = {
                    userId:  user.uid,
                    todoText: todoText,
                    date: new Date(deadline).getTime()
                };
                const currentDate = new Date().getTime();
                const datetimeInput = new Date(deadline).getTime();
    
                currentDate > datetimeInput 
                ? alert("Você informou uma data no passado...")
                : addFirestore(objDatas);
                getDatasFirestore();
            }

            form.reset();
        },
        deleteTodo: event => {
            const target = event.target;
            const docId = target.dataset.id;
            
            deleteDoc(doc(db, "todos", docId));
        }
    };

    function addFirestore(obj) {
        try {
            addDoc(collection(db, "todos"), obj);

            alert('Tarefa cadastrada com sucesso!');
        } catch (e) {
          console.error("Error adding document: ", e);
        }
    }

    function getDatasFirestore(){
        const queryUser = query(collection(db, "todos"), where("userId", "==", user.uid));

        onSnapshot(queryUser, (data) => {
            const todoListContainer = document.querySelector('.todo-list-box');
            let todoResultHTML;

            // Adding todos list order by more current:
            let todos = data.docs;
            todos = todos.sort((a, b) => {
                a.data().date < b.data().date ? -1 : +1;
            });
            console.log(todos);
            
            todos.length == 0
            ? todoResultHTML = `
                <h2 class="subtitle my-24 text-red">Você não cadastrou nenhuma tarefa :(</h2>
                <img
                    class="todo-list-box__img"
                    src="../src/assets/empty.svg"
                    alt="Ilustração de duas pessoas olhando numa caixa fazia"
                />
            `
            : todoResultHTML = `
                <div class="todo-list">
                    <ul class="todo-list__list">
                        ${todos.map(dataDocs => `
                            <li class="todo-list__item py-8 text">
                                ${dataDocs.data().todoText}
                                <button class="todo-list__btn-delete" onclick="todoPage.deleteTodo(event)" data-id=${dataDocs.id}>
                                    (X)
                                </button>
                            </li>
                        `).join("")}
                    </ul>
                </div class="todo-list">
            `;
            
            todoListContainer.textContent = '';
            todoListContainer.insertAdjacentHTML('beforeend', todoResultHTML);
        });
    }

    function hideTodoPage(){
        loginPage.classList.remove('login--disable');
        todoPage.classList.remove('todo--active');
    }

    if(user !== null)
        getDatasFirestore(); 

    return`
        <main class="todo-box container">
            <section>
                <h1 class="title my-16">Cadastre uma nova tarefa!</h1>

                <form class="todo-box__form-todo" onsubmit="todoPage.setTodo(event)">
                    <fieldset class="input-box">
                        <label class="todo-box__label text-small" for="todo">Tarefa:</label>
                        <textarea class="todo-box__textarea" required name="todo" id="todo" placeholder="Escreva uma tarefa..."></textarea>
                    </fieldset>

                    <fieldset class="input-box">
                        <label class="todo-box__label text-small" for="datetime">Data:</label>
                        <input class="todo-box__input" required type="datetime-local" id="datetime" name="datetime" />
                    </fieldset>

                    <fieldset class="todo-box__btns my-24">
                        <input class="todo-box__btns__btn text-small" type="submit" value="Cadastrar tarefa" name="todoSub" />
                        <button class="todo-box__btns__btn text-small" onclick="todoPage.loggout(event)">Loggout</button>
                    </fieldset>
                </form>
            </section>

            <section class="todo-list-box"></section>
        </main><!--todo-box-->
    `;
}