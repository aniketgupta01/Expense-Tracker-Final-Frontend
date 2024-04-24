const loginForm = document.querySelector('#login-form')
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

loginForm.addEventListener('submit',loginFormSubmit);

async function loginFormSubmit(e){
    e.preventDefault();

    let obj = {
        email:emailInput.value,
        password:passwordInput.value
    }

    try{
        let result = axios.post("http://localhost:6500/user/login",obj);
        loginForm.reset();

        if(result.data == 'success'){
            showMessage('You are logged in!','success')
        }
        else if(result.data == 'not found'){
            showMessage('User not found!','error')
        }
        else{
            showMessage('Incorrect Password','error')
        }
    }
    catch(err){
        console.log(err);
    }
}

function showMessage(message, messageType) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    messageDiv.className = `message ${messageType}`;

    messageContainer.innerHTML = ''; 
    messageContainer.appendChild(messageDiv);

    setTimeout(function() {
        messageDiv.remove(); 
    }, 2000);
}
