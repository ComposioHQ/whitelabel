import { NextResponse } from 'next/server';
import { OpenAIToolSet } from 'composio-core';
const toolset = new OpenAIToolSet({ apiKey: process.env.COMPOSIO_API_KEY });
const composio = toolset.client;

const appIntegrationIds = {
    "TWITTER": process.env.TWITTER_INTEGRATION_ID,
    "GITHUB": process.env.GITHUB_INTEGRATION_ID,
    "JIRA": process.env.JIRA_INTEGRATION_ID,
    "CLICKUP": process.env.CLICKUP_INTEGRATION_ID,
    "SHOPIFY": process.env.SHOPIFY_INTEGRATION_ID
};

export async function POST(request) {
    const requestData = await request.json();
    const { entityId, appName, ...formData } = requestData;

    try {
        const integrationId = appIntegrationIds[appName];
        if (!integrationId) {
            throw new Error(`Invalid app name: ${appName}`);
        }

        const expectedInputFieldsResponse = await toolset.getExpectedParamsForUser({ integrationId });
        const expectedInputFields = expectedInputFieldsResponse.expectedInputFields;

        const data = {};
        for (const field of expectedInputFields) {
            if (formData[field.name]) {
                data[field.name] = formData[field.name];
            } else if (field.required) {
                throw new Error(`Missing required field: ${field.name}`);
            }
        }
        const connectedAccount = await composio.connectedAccounts.initiate({
            integrationId,
            userUuid: entityId,
            data: data
        });
        console.log("connectedAccount :: ", connectedAccount);
        return NextResponse.json({
            authenticated: connectedAccount.connectionStatus === "ACTIVE" ? true : false,
        }, { status: 200});
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
