
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
            body: "Please provide all required
