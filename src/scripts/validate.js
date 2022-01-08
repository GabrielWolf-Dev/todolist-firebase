function checkEmail(emailValue, emailInput){
    const regExpEmail = /^(\w+)@(gmail|hotmail|outlook|uol)(\.com|\.com\.br|\.net|\.org)$/;
    const msgErrorDiv = emailInput.closest(".input-box").children[2];

    if(regExpEmail.test(emailValue)){
        msgErrorDiv.classList.remove("msg-error--active");
        showCheckIcon(emailInput);
        return true;
    }else {
        msgErrorDiv.classList.add("msg-error--active");
        showErrorIcon(emailInput);
        return false;
    }
}

function checkPass(passValue, passInput) {
    const regExpPass = /^[#?!@$%^&*A-Za-z\d]{8,}$/;
    const msgErrorDiv = passInput.closest(".input-box").children[2];

    if(!regExpPass.test(passValue)){
        msgErrorDiv.classList.add("msg-error--active");
        showErrorIcon(passInput);
        return false;
    }else {
        msgErrorDiv.classList.remove("msg-error--active");
        showCheckIcon(passInput);
        return true;
    }
};

function checkTextTodo(textValue, textInput) {
    const regExpPass = /^(\w+[-çãí]*\s*)+$/;

    if(!regExpPass.test(textValue)){
        alert("Não é possível colocar caracteres especiais, somente (_ e -)");
        showErrorIcon(textInput);
        return false;
    }else {
        showCheckIcon(textInput);
        return true;
    }
};

function showErrorIcon(input) {
    input.classList.add('input--error');
    input.classList.remove('input--check');
}

function showCheckIcon(input) {
    input.classList.remove('input--error');
    input.classList.add('input--check');
}

export {
    checkEmail,
    checkPass,
    checkTextTodo
};