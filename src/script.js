
async function calculateDebt() {
    let initialDebt = parseFloat(document.getElementById('initialDebt').value);
    let months = parseInt(document.getElementById('months').value);
    let monthlyInterest = 0.42;

    if (isNaN(initialDebt) || isNaN(months)) {
        alert("Bitte geben Sie gültige Werte ein.");
        return;
    }

    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initialDebt, months, monthlyInterest })
    });

    const data = await response.json();

    document.getElementById('result').innerHTML = `
        <h2>Ergebnis</h2>
        <p>Nach ${months} Monaten betragen Ihre Schulden: CHF ${data.totalDebt.toFixed(2)}</p>
    `;
}
