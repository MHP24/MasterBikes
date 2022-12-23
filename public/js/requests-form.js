const getPayment = () => {
    let bikePrice = parseInt(document.getElementById('field__type').value.split('-')[1])
    let timePrice = parseInt(document.getElementById('field__days').value.split('-')[1])
    document.getElementById('payment-mount').value = bikePrice + timePrice;
}

document.getElementById('calc-payment').addEventListener('click', (e) => {
    e.preventDefault();
    getPayment();
});