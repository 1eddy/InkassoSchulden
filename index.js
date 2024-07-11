const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const debtData = req.body;

    const endpoint = process.env.CosmosDBEndpoint;
    const key = process.env.CosmosDBKey;
    const client = new CosmosClient({ endpoint, key });

    const database = client.database("InkassoDB");
    const container = database.container("Debts");

    try {
        const { resource: createdItem } = await container.items.create(debtData);
        context.res = {
            status: 200,
            body: createdItem
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error.message
        };
    }
};
