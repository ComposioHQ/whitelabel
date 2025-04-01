import { NextResponse } from 'next/server';
import { ComposioToolSet } from 'composio-core';
const toolset = new ComposioToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

const appIntegrationIds = {
    "TWITTER": process.env.TWITTER_INTEGRATION_ID,
    "GITHUB": process.env.GITHUB_INTEGRATION_ID,
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
        const expectedInputFields = await toolset.integrations.getRequiredParams({ integrationId });

        return NextResponse.json({
            expectedInputFields
        }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
