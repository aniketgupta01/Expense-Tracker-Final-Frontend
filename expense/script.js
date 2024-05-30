const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const expenseForm = document.querySelector('#expense-form');
const expenseContainer = document.querySelector('#expense-list')
const rzp_button = document.getElementById('rzp-button');
const divarea = document.getElementById('divarea');
const premium = document.getElementById('premium')
const userName = document.getElementById('user-name');


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
    <li>${amount} - ${description} - ${category} <button class="btn btn-danger" onclick=deleteExpense(${expense_id})>Delete</button></li>
    
</ul>`;

    expenseContainer.appendChild(expenseDiv);



}

window.addEventListener('DOMContentLoaded',async() => {
    const token = localStorage.getItem('token')
    
    let expenses = await axios.get('http://localhost:6500/expense/get-expenses',{headers:{"Authorization":token}});
    userName.innerHTML = expenses.data.userName;
    if(expenses.data.isPremium){
        showPremium();
        downloadReport();
        showReport();
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
        downloadReport();
        

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

function downloadReport(){
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = "Download Report";
    downloadButton.classList = "button button-download"
    divarea.appendChild(downloadButton);
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

// function showLeaderboard(){
//     const leaderboard_button = document.createElement('input');
//         leaderboard_button.type = 'button';
//         leaderboard_button.value = 'Show Leaderboard';
//         leaderboard_button.classList = "button button-leaderboard"
//         leaderboard_button.onclick = async () => {
//         //     leaderboard_button.value = 'Close'
//         //     leaderboard_button.onclick = () => {
//         //         closeLeaderboard();
//         //     }
//         //     const token = localStorage.getItem('token');
//         //     const userLeaderboardArray = await axios.get('http://localhost:6500/premium/showLeaderboard',{headers:{
//         //         'Authorization':token
//         //     }})
//         //     console.log(userLeaderboardArray);
//         //     var leaderboard = document.getElementById('leaderboard');
//         //     leaderboard.innerHTML += '<h1> Leaderboard </h1>';
//         //     userLeaderboardArray.data.forEach((userDetails) => {
//         //         leaderboard.innerHTML += `<li> Name - ${userDetails.name} : Total Expense - ${userDetails.totalExpense}`
//         //     })

//         // }

//         divarea.appendChild(leaderboard_button);
// }




// }
async function showLeaderboard(){
    const leaderboardButton = document.getElementById('leaderboard-button');
            const token = localStorage.getItem('token');
            const userLeaderboardArray = await axios.get('http://localhost:6500/premium/showLeaderboard',{headers:{
                'Authorization':token
            }})
            
            var leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML += '<h1> Leaderboard </h1>';
            userLeaderboardArray.data.forEach((userDetails) => {
                leaderboard.innerHTML += `<li> Name - ${userDetails.name} : Total Expense - ${userDetails.totalExpense}`
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
                console.log('aaaaaaa')
                showLeaderboard();

            }

        }
