window.onload = init

function init(){
    const form = document.getElementById("registro");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = {
            username : e.target[0].value,
            password : e.target[1].value,
        }
        const res = await fetch("http://localhost:3000/api/login", {
            method : "POST",
            headers :{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(datos)
        })
        
        if(!res.ok){
            return
        }
        const resJson = await res.json();
        if(resJson.redirect){
            window.location.href = resJson.redirect
        }
    })
}