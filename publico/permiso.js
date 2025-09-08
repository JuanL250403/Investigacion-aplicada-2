
window.onload = init 
function init(req, res){
    const oculto = document.getElementById("oculto");
    const imagen = document.getElementById("protegido");
    const btn = document.getElementById("cerrarS");
    const rgs = document.getElementById("registrarse")
    const inic = document.getElementById("iniciar")

    const token = document.cookie.slice(4)

    if(token){
        inic.disabled = true
        document.getElementById("estado").innerHTML = "¡La sesión esta activa!"
    }
    else{
        document.getElementById("estado").innerHTML = "No ha iniciado sesion"
    }
    inic.addEventListener("click", () =>{
        window.location.href = "/login"
    })
    rgs.addEventListener("click", () => {
        window.location.href = "/register"
    })
    oculto.addEventListener("click", async() =>{
        const cookieJWT = token;
        const header = {
            method: 'GET', 
            headers: {Authorization: "Bearer " + cookieJWT}
        }
        const get = await fetch("http://localhost:3000/api/protected-resource", header)
        .then(traido => traido.json())
        .then(dato => {
            console.log(dato.protegido)
            src = dato.protegido;
        });
        imagen.setAttribute("src", src)
    })

    btn.addEventListener("click", async() =>{   
        const cookieJWT = document.cookie.slice(4);
        const header = {
            method: 'POST', 
            headers: {Authorization: "Bearer " + cookieJWT}
        }
        const get = await fetch("http://localhost:3000/api/logout", header)
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    })


}   