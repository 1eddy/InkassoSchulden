async function calculateDebt() {
    let initialDebt = parseFloat(document.getElementById('initialDebt').value);
    let months = parseInt(document.getElementById('months').value);
    let monthlyInterest = 0.42 / 100;

    if (isNaN(initialDebt) || isNaN(months)) {
        alert("Bitte geben Sie gültige Werte ein.");
        return;
    }

    let totalDebt = initialDebt;
    for (let i = 0; i < months; i++) {
        totalDebt += totalDebt * monthlyInterest;
    }

    document.getElementById('result').innerHTML = `
        <h2>Ergebnis</h2>
        <p>Nach ${months} Monaten betragen Ihre Schulden: CHF ${totalDebt.toFixed(2)}</p>
    `;

    // Daten an die Azure Function senden
    await fetch('/api/saveDebt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            initialDebt: initialDebt,
            months: months,
            monthlyInterest: monthlyInterest * 100
        })
    });
}
