const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const expenseForm = document.querySelector('#expense-form');
const expenseContainer = document.querySelector('#expense-list')
const rzp_button = document.getElementById('rzp-button');
const divarea = document.getElementById('divarea');
const premium = document.getElementById('premium')
const userName = document.getElementById('user-name');
const pagination = document.getElementById('pagination');


expenseForm.addEventListener('submit',submitExpense);

async function submitExpense(e){
    e.preventDefault();
    let obj = {
        amount:amountInput.value,
        description:descriptionInput.value,
        category:categoryInput.value
    }

    try{
        const token = localStorage.getItem('token')
        let result = await axios.post('http://localhost:6500/expense/add-expense',obj,{headers:{'Authorization':token}});
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
    <li>₹${amount} - ${description} - ${category} <button class="btn btn-danger" onclick=deleteExpense(${expense_id})>Delete</button></li>
    
</ul>`;

    expenseContainer.appendChild(expenseDiv);



}

window.addEventListener('DOMContentLoaded',async() => {
     const page = 1;
    const token = localStorage.getItem('token')
    
    let expenses = await axios.get(`http://localhost:6500/expense/get-expenses?page=${page}`,{headers:{"Authorization":token}});
    showPagination(expenses.data);
    userName.innerHTML = expenses.data.userName;
    if(expenses.data.isPremium){
        showPremium();
        // downloadReport();
        showReport();
        previousDownloads();
    }

    for(let i=0;i<expenses.data.allExpenses.length;i++){
        showExpense(expenses.data.allExpenses[i]);
    }

})



async function deleteExpense(id){
    const token = localStorage.getItem('token')
    let result = await axios.get(`http://localhost:6500/expense/delete-expense/${id}`,{headers : {"Authorization" : token}});

    removeExpense(id);

}

function removeExpense(id){
    const childNode = document.getElementById(id);
    expenseContainer.removeChild(childNode);
}



document.getElementById('rzp-button').onclick = async function (e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:6500/purchase/premiumMembership',{headers : {"Authorization" : token}})

    console.log(response);

    var options = {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler": async function(response){
            await axios.post('http://localhost:6500/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                status:'SUCCESSFUL'

            },{headers : {"Authorization" : token}}
        )
        showPremium();
        showReport();
        // downloadReport();
        previousDownloads();
        

        }
    }
    console.log(options)
    const rzp1 = new Razorpay(options);
    console.log(rzp1);
    rzp1.open();
   

    rzp1.on('payment.failed', async function(response){
        console.log(response);
        await axios.post('http://localhost:6500/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                status:'FAILED'

            },{headers : {"Authorization" : token}}
        )
        alert('Something went wrong')
    })
}

function showPremium(){
    const p = document.createElement('p');
        p.innerHTML="You are a premium user now."
        rzp_button.remove();
        premium.appendChild(p);
        const leaderboard_button = document.createElement('input');
        leaderboard_button.type = 'button';
        leaderboard_button.value = 'Show Leaderboard';
        leaderboard_button.id = 'leaderboard-button';
        leaderboard_button.classList = "button button-leaderboard"
        leaderboard_button.onclick = () => {
            showLeaderboard();
        }
        divarea.appendChild(leaderboard_button);
}
async function previousDownloads(){
    const previousButton = document.createElement('button');
    previousButton.innerHTML = "Previous Downloads"
    previousButton.classList = "button button-download "
    previousButton.addEventListener('click',async() => {
        window.location.href = "../previous-download/index.html"
    })



    divarea.appendChild(previousButton)
}     
function showReport(){
    const showReportButton = document.createElement('button');
    showReportButton.innerHTML = "Show Expense Report"
    showReportButton.classList = "button button-show"
    divarea.appendChild(showReportButton)

    showReportButton.addEventListener('click',() => {
        window.location.href = "../expense-report/index.html"
    })
}

async function showLeaderboard(){
    const leaderboardButton = document.getElementById('leaderboard-button');
            const token = localStorage.getItem('token');
            const userLeaderboardArray = await axios.get('http://localhost:6500/premium/showLeaderboard',{headers:{
                'Authorization':token
            }})
            
            var leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML += '<h1> Leaderboard </h1>';
            userLeaderboardArray.data.forEach((userDetails) => {
                leaderboard.innerHTML += `<li> Name - ${userDetails.name} : Total Expense - ₹${userDetails.totalExpense}`
            })
            leaderboardButton.value = 'Close'
            leaderboardButton.onclick = () => {
                closeLeaderboard();
            }

        }
        function closeLeaderboard(){
            leaderboard.innerHTML=""
            const leaderboardButton = document.getElementById('leaderboard-button');
            leaderboardButton.value = "Show Leaderboard"
            leaderboardButton.onclick = () => {
                showLeaderboard();

            }

        }


function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}
) {
    expenseContainer.innerHTML = "";
    pagination.innerHTML=""

    if(hasPreviousPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => getProducts(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click', () => getProducts(currentPage));
    pagination.appendChild(btn1)

    if(hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => getProducts(nextPage));
        pagination.appendChild(btn3);
    }
}      

async function getProducts(page){
    const token = localStorage.getItem('token');
    let expenses = await axios.get(`http://localhost:6500/expense/get-expenses?page=${page}`,{headers:{"Authorization":token}});
    showPagination(expenses.data);

    for(let i=0;i<expenses.data.allExpenses.length;i++){
        showExpense(expenses.data.allExpenses[i]);
    }
    
}



   
