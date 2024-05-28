const emailInput = document.getElementById('email');
const forgotPassForm = document.getElementById('forgot-password');

forgotPassForm.addEventListener('submit',forgotPassword);

async function forgotPassword(e){
    e.preventDefault();


    try{
        const result = await axios.post('http://localhost:6500/password/forgot-password',{email:emailInput.value});
        forgotPassForm.reset();
        alert('An email to reset password has been sent!')
    }
    catch(err){
        console.log(err);
    }

}