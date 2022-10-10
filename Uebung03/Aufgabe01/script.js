function farbe() {

    var eing = document.querySelector("#src");
    var ausg = document.querySelector("#dst");
    var random = Math.floor(Math.random()*16777215).toString(16)

    var farbe = "#" + random;
    
    ausg.style.color = farbe;
    ausg.style.fontSize = "200px";
    ausg.innerHTML = eing.value;
}