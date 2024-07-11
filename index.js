const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.CosmosDBConnectionString;
const key = process.env.CosmosDBKey;

const client = new CosmosClient({ endpoint, key });
const databaseId = "InkassoDatabase";
const containerId = "SchuldenContainer";

module.exports = async function (context, req) {
    const { initialDebt, months, monthlyInterest } = req.body;

    if (!initialDebt || !months || !monthlyInterest) {
        context.res = {
            status: 400,
            body: "Please provide all required fields: initialDebt, months, monthlyInterest."
        };
        return;
    }

    let totalDebt = parseFloat(initialDebt);
    for (let i = 0; i < parseInt(months); i++) {
        totalDebt += totalDebt * (parseFloat(monthlyInterest) / 100);
    }

    const item = {
        initialDebt: initialDebt,
        months: months,
        monthlyInterest: monthlyInterest,
        totalDebt: totalDebt.toFixed(2),
        timestamp: new Date().toISOString()
    };

    try {
        const { database } = await client.databases.createIfNotExists({ id: databaseId });
        const { container } = await database.containers.createIfNotExists({ id: containerId });

        const { resource } = await container.items.create(item);

        context.res = {
            status: 200,
            body: `Schuldenbetrag erfolgreich gespeichert: ${resource.id}`
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Fehler beim Speichern des Schuldenbetrags: ${error.message}`
        };
    }
};
