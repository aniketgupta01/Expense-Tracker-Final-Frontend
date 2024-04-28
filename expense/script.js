const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const expenseForm = document.querySelector('#expense-form');
const expenseContainer = document.querySelector('#expense-list')

expenseForm.addEventListener('submit',submitExpense);

async function submitExpense(e){
    e.preventDefault();
    let obj = {
        amount:amountInput.value,
        description:descriptionInput.value,
        category:categoryInput.value
    }

    try{
        let result = await axios.post('http://localhost:6500/expense/add-expense',obj);
        showExpense(result.data); 
        expenseForm.reset();
    }
    catch(err){
        console.log(err);
    }
}


function showExpense(obj){
    const amount = obj.amount;
    const description = obj.description;
    const category = obj.category;
    const expense_id = obj.id;

    const expenseDiv = document.createElement('div');
    expenseDiv.id = expense_id;
    expenseDiv.className = "expense-container";
    expenseDiv.innerHTML = `<ul>
    <li>${amount} - ${description} - ${category} <button class="btn btn-danger" onclick=deleteExpense(${expense_id})>Delete</button></li>
    
</ul>`;

    expenseContainer.appendChild(expenseDiv);



}

window.addEventListener('DOMContentLoaded',async() => {
    let expenses = await axios.get('http://localhost:6500/expense/get-expenses');

    for(let i=0;i<expenses.data.length;i++){
        showExpense(expenses.data[i]);
    }

})



async function deleteExpense(id){
    let result = await axios.get(`http://localhost:6500/expense/delete-expense/${id}`);

    removeExpense(id);

}

function removeExpense(id){
    const childNode = document.getElementById(id);
    expenseContainer.removeChild(childNode);
}