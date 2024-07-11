const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.CosmosDBEndpoint;
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

    const totalDebt = calculateDebt(initialDebt, months, monthlyInterest);

    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });

    const newItem = {
        id: context.executionContext.invocationId,
        initialDebt,
        months,
        monthlyInterest,
        totalDebt
    };

    const { resource } = await container.items.create(newItem);

    context.res = {
        status: 200,
        body: resource
    };
};

function calculateDebt(initialDebt, months, monthlyInterest) {
    let totalDebt = initialDebt;
    for (let i = 0; i < months; i++) {
        totalDebt += totalDebt * (monthlyInterest / 100);
    }
    return totalDebt;
}
