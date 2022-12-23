
let nav = document.querySelector(".nav");
let hamburguer = document.getElementById('menu');

hamburguer.addEventListener("click", () => {
    nav.classList.toggle("hiddeNav");
});

window.addEventListener("click", w => {
    if(!nav.classList.contains("hiddeNav") && w.target != document.querySelector(".nav")
    && w.target != hamburguer ) {
        nav.classList.toggle("hiddeNav");

    }
});