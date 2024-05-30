const loginForm = document.querySelector('#login-form')
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const messageContainer = document.querySelector('#messageContainer')

loginForm.addEventListener('submit',loginFormSubmit);

async function loginFormSubmit(e){
    e.preventDefault();

    let obj = {
        email:emailInput.value,
        password:passwordInput.value
    }

    try{
        let result = await axios.post("http://localhost:6500/user/login",obj);
        loginForm.reset();

        if(result.data.message == 'success'){
             showMessage('You are logged in!','success')
             .then(() => {
                localStorage.setItem('token',result.data.token);
                window.location.href = "../expense/index.html"
             })
        }
    }
    catch(err){
        if(err.response.status === 404){
            showMessage('User not found!','error')
        }
        else{
            showMessage('Incorrect Password','error')
        }
    }
}

function showMessage(message, messageType) {
    return new Promise((resolve, reject) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
    
        messageDiv.className = `message ${messageType}`;
    
        messageContainer.innerHTML = ''; 
        messageContainer.appendChild(messageDiv);
    
        setTimeout(function() {
            messageDiv.remove(); 
            resolve();
        }, 500);

    })
   
}
