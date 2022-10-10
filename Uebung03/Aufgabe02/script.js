function uhr() {
    var date = new Date();
    var ds = date.toDateString();
    var ts = date.toTimeString();

    const today = document.querySelector("#date");
    const time = document.querySelector("#time");

    today.innerHTML = ds;
    time.innerHTML = ts;
    setTimeout(uhr, 500);
}