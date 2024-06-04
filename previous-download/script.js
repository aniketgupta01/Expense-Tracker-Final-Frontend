const downloadList = document.getElementById('downloads');

window.addEventListener('DOMContentLoaded', async() => {
    const token = localStorage.getItem('token');
        try{
            const result = await axios.get('http://localhost:6500/expense/get-downloads',{headers:{'Authorization':token}})
            if(result.data.downloadList.length === 0){
                showLinks(0);
            }
            const h1 = document.createElement('h1');
            h1.innerHTML = "Previous Downloads";
            h1.classList = "text-center "
            downloadList.appendChild(h1);
            result.data.downloadList.forEach((data)=>{
                showLinks(data.url);
            })
        
        
            
        }
        catch(err){
            console.log(err)
        }


})

function showLinks(link){
    if(link === 0){
       return  alert('You have no previous downloads')
    }
    const list = document.createElement('div')
    list.classList = "link-c"
    list.innerHTML = `<li><ul><a href="${link}">${link}</a></ul></li>`;
    downloadList.appendChild(list);

}