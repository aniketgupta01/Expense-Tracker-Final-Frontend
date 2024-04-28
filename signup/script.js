const signupForm = document.querySelector('#signup-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const messageContainer = document.querySelector('#messageContainer');


signupForm.addEventListener('submit',signUpFormSubmit);

async function signUpFormSubmit(e){
    e.preventDefault();

    let obj = {
        name:nameInput.value,
        email:emailInput.value,
        password:passwordInput.value
    }

    try{
        const user = await axios.post('http://localhost:6500/user/signup',obj);
        signupForm.reset();
        console.log(user)
        if (user.status==200) {
            showMessage('User created successfully!', 'success');
        } else {
            showMessage('User already exists!', 'error');
        }

    }
    catch(err){
        console.log(err)
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
    }, 4000);
}