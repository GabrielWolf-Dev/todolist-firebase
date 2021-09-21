import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import Todo from '../Todo/index.js';

import '../../styles/generic/form.css';
import '../../styles/generic/message.css';
import '../../styles/objects/spaces.css';

export default function LoginPage(user){
    const auth = getAuth();

    let loginPage = document.querySelector('.login');
    let todoPage = document.querySelector('.todo-box');

    window.loginPage = {
        loginAuth: event => {
            event.preventDefault();
            const form = event.target;

            const inputs = new FormData(form);
            const email = inputs.get('emailLogin');
            const passwd = inputs.get('passwdLogin');
            

            // Auth User:
            
            signInWithEmailAndPassword(auth, email, passwd)
            .then((userCredential) => {
              user = userCredential.user;
            
              Todo(user);
              showTodoPage();
              
              // Clear inputs:
              form.reset();
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const msgErrorLogin = form.children[4];
              console.log(msgErrorLogin);
              msgErrorLogin.classList.add('msg-error--active');
              setTimeout(() => msgErrorLogin.classList.remove('msg-error--active'), 2000);
              
              console.error(errorMessage);
              console.log(errorCode);
            });
        },
        showRegisterPage: () => {
            const registerPage = document.querySelector('.register');

            loginPage.classList.add('login--disable');
            registerPage.classList.add('register--active');
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

            <form class="form" onsubmit="loginPage.loginAuth(event)">
                <fieldset class="input-box">
                    <label class="form__input-label text-small" for="email">E-mail:</label>
                    <input type="text" placeholder="E-mail" class="form__input" id="email" name="emailLogin" required />
                </fieldset>

                <fieldset class="input-box">
                    <label class="form__input-label text-small" for="passwd">Senha:</label>
                    <input type="password" placeholder="Senha" class="form__input" id="passwd" name="passwdLogin" required />
                </fieldset>

                <input type="submit" class="form__submit my-16" value="Logar" />
                <button class="form__registerBtn" onclick="loginPage.showRegisterPage()">Registrar-se</button>
                <div class="msg-error">Não foi possível fazer o login, verifique os campos novamente</div>
            </form>
        </section><!--login-->
    `;
}