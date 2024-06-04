const yearHeading = document.getElementById('year-heading')
const monthHeading = document.getElementById('month-heading')
const monthTable = document.getElementById('monthtable')
const yearTable = document.getElementById('yeartable');
const monthTotal = document.getElementById('month-totalexpense');
const yearTotal = document.getElementById('year-totalexpense')

window.addEventListener('DOMContentLoaded',async() => {

    const date = new Date();
const year = date.getFullYear()
const month = date.toLocaleString('default', { month: 'long' });

yearHeading.innerHTML = year
monthHeading.innerHTML = `${month} ${year}`;

const token = localStorage.getItem('token')
const expense = await axios.get('http://localhost:6500/expense/get-expenses',{headers:{'Authorization':token}});
const allExpenses = expense.data.allExpenses;
let totalExpense = 0;
allExpenses.forEach((expense) => {
    const date = expense.createdAt.split('T')[0];
    const description = expense.description;
    const category = expense.category;
    const amount = expense.amount;
    const expenseRow = `<tr>
    <th>${date}</th>
    <th>${description}</th>
    <th>${category}</th>
    <th>0</th>
    <th>${amount}</th>
</tr>`
totalExpense += amount;
monthTable.innerHTML += expenseRow



})

monthTotal.innerHTML = `Total Expense = ${totalExpense}` 

const expenseRow = `<tr>
<th>${month}</th>
<th>0</th>
<th>${totalExpense}</th>
<th>${0-totalExpense}</th>
</tr>`
yearTable.innerHTML += expenseRow



})

async function downloadReport(){
    const token = localStorage.getItem('token');
    try{
    const result = await axios.get('http://localhost:6500/expense/download',{headers:{'Authorization':token}})
    if(result.status === 200){
        var a = document.createElement('a');
        a.href = result.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
    }
    else{
        throw new Error(response.data.message)
    }
}
catch(err){
    console.log(err)
}
}



