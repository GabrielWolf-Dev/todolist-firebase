import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import Todo from '../Todo/index.js';
import { checkEmail, checkPass } from '../../scripts/validate';

import './style.css';
import '../../styles/generic/message.css';
import '../../styles/objects/spaces.css';

export default function LoginPage(user){
    const auth = getAuth();

    let loginPage;
    let todoPage;

    window.loginPage = {
        loginAuth: event => {
            event.preventDefault();
            const form = event.target;

            const inputs = new FormData(form);
            const email = inputs.get('email');
            const passwd = inputs.get('passwd');
            loginPage = document.querySelector('.login');
            todoPage = document.querySelector('.todo-box');
            
            const isChekedEmail = checkEmail(email, form[1]);
            const idChekedPass = checkPass(passwd, form[3]);

            // Auth User:
            if(isChekedEmail && idChekedPass){
                signInWithEmailAndPassword(auth, email, passwd)
                .then((userCredential) => {
                  user = userCredential.user;
                
                  Todo(user);
                  showTodoPage();
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  const msgErrorLogin = form.children[3];

                  msgErrorLogin.classList.add('msg-error--active');
                  setTimeout(() => msgErrorLogin.classList.remove('msg-error--active'), 1500);
                  
                  console.error(errorMessage);
                  console.log(errorCode);
                });  
            }

            // Clear inputs:
            form.reset();
        }
    };

    onAuthStateChanged(auth, dataUser => {
        loginPage = document.querySelector('.login');
        todoPage = document.querySelector('.todo-box');
        
        if(dataUser){
            user = dataUser;
            alert('Olá novamente ' +  user.email);
            Todo(user);
            showTodoPage();
        }
    });

    function showTodoPage(){
        loginPage.classList.add('login--disable');
        todoPage.classList.add('todo--active');
    }

    return`
        <section class="login container">
            <h1 class="title my-24">Faça o login:</h1>

            <form class="login__form" onsubmit="loginPage.loginAuth(event)">
                <fieldset class="input-box">
                    <label class="login__input-label text-small" for="email">E-mail:</label>
                    <input type="text" placeholder="E-mail" class="login__input" name="email" required />
                    <div class="msg-error">Insira um e-mail válido. Somente aceitamos: hotmail, gmail, outlook ou uol</div>
                </fieldset>

                <fieldset class="input-box">
                    <label class="login__input-label text-small" for="passwd">Senha:</label>
                    <input type="password" placeholder="Senha" class="login__input" name="passwd" required />
                    <div class="msg-error">É preciso ter no mínimo 8 caracteres</div>
                </fieldset>

                <input type="submit" class="login__submit my-16" value="Logar" />
                <div class="msg-error">Não foi possível fazer o login, verifique os campos novamente</div>
            </form>
        </section><!--login-->
    `;
}