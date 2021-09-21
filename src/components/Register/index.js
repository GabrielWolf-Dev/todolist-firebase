import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { checkEmail, checkPass } from "../../scripts/validate";
import Todo from "../Todo";

import '../../styles/generic/form.css';
import '../../styles/generic/message.css';
import '../../styles/objects/spaces.css';

export default function Register(){
    const auth = getAuth();

    window.registerPage = {
        registerAccount: (event) => {
            event.preventDefault();
            const form = event.target;
            const inputs = new FormData(form);
            const email = inputs.get("emailRegister");
            const passwd = inputs.get("passwdRegister");

            const emailSanitize = sanitizeString(email);
            const passwdSanitize = sanitizeString(passwd);
            const isChekedEmail = checkEmail(emailSanitize, form[1]);
            const idChekedPass = checkPass(passwdSanitize, form[3]);

            if(isChekedEmail && idChekedPass)
                createUserWithEmailAndPassword(auth, emailSanitize, passwdSanitize)
                .then((userCredential) => {
                  const user = userCredential.user;

                  Todo(user);
                  showTodoPage();

                  // Clear inputs:
                  form.reset();
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;

                  if(errorMessage == "Firebase: Error (auth/email-already-in-use).")
                    alert("Esse e-mail já existe!");
                
                  console.error(errorCode);
                });
        },
        showLoginPage: () => {
            const loginPage = document.querySelector('.login');
            const registerPage = document.querySelector('.register');

            registerPage.classList.remove("register--active");
            loginPage.classList.remove("login--disable");
        }
    };

    function showTodoPage(){
        const registerPage = document.querySelector('.register');
        const todoPage = document.querySelector('.todo-box');

        registerPage.classList.remove("register--active");
        todoPage.classList.add('todo--active');
    }

    function sanitizeString(string) {
        let emailSanitized;
        const stringsInvalidate = ["<", ">", "/", "<script></script>"];
        const scriptMsg = "Script Injection";

        for(let i = 0; i <= stringsInvalidate.length; i++){
            if(string.indexOf(stringsInvalidate[i]) === 0){
                emailSanitized = scriptMsg;
                break;
            } else {
                emailSanitized = string;
            }
        }
        
        return emailSanitized;
    };

    return`
    <section class="register container">
        <h1 class="title my-24">Registrar conta:</h1>

        <form class="form" onsubmit="registerPage.registerAccount(event)">
            <fieldset class="input-box">
                <label class="form__input-label" for="emailRegister">E-mail:</label>
                <input required class="form__input" type="email" placeholder="Insira um E-mail válido" id="emailRegister" name="emailRegister" />
                <div class="msg-error">Insira um e-mail válido. Somente aceitamos: hotmail, gmail, outlook ou uol</div>
            </fieldset>
            <fieldset class="input-box">
                <label class="form__input-label" for="passwdRegister">Senha:</label>
                <input required class="form__input" type="password" placeholder="Insira uma senha com o mínimo de 8 caracteres" id="passwdRegister" name="passwdRegister" />
                <div class="msg-error">É preciso ter no mínimo 8 caracteres</div>
            </fieldset>

            <input class="form__submit my-16" type="submit" value="Registrar" />
            <button type="button" class="form__loginBtn" onclick="registerPage.showLoginPage()">Página de login</button>
        </form>
    </section>
    `;
}