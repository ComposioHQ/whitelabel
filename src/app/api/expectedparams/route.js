import { NextResponse } from 'next/server';
import { OpenAIToolSet } from 'composio-core';
const toolset = new OpenAIToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

const appIntegrationIds = {
    "TWITTER": process.env.TWITTER_INTEGRATION_ID,
    "GITHUB": process.env.GITHUB_INTEGRATION_ID,
    "JIRA": process.env.JIRA_INTEGRATION_ID,
    "CLICKUP": process.env.CLICKUP_INTEGRATION_ID,
    "SHOPIFY": process.env.SHOPIFY_INTEGRATION_ID
};

export async function POST(request) {
    const requestData = await request.json();
    const { appName } = requestData;

    try {
        const integrationId = appIntegrationIds[appName];
        if (!integrationId) {
            throw new Error(`Invalid app name: ${appName}`);
        }

        const expectedInputFieldsResponse = await toolset.getExpectedParamsForUser({ integrationId });
        const expectedInputFields = expectedInputFieldsResponse.expectedInputFields;

        return NextResponse.json({
            expectedInputFields
        }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
