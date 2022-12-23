window.addEventListener('load', () => {
    let navigation = document.querySelector('.nav__items');
    let navigationButton = document.getElementById('nav__menu');
    navigationButton.addEventListener('click', () => {
        navigation.classList.toggle('show-nav');
    });

});