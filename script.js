const signupForm = document.querySelector('#signup-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

signupForm.addEventListener('submit',signUpFormSubmit);

async function signUpFormSubmit(e){
    e.preventDefault();

    let obj = {
        name:nameInput.value,
        email:emailInput.value,
        password:passwordInput.value
    }

    try{
        const user = await axios.post('http://localhost:3000/user/signup',obj);
        console.log(user);
    }
    catch(err){
        console.log(err)
    }

}