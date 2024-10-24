import { NextResponse } from 'next/server';
import { OpenAIToolSet } from 'composio-core';
const toolset = new OpenAIToolSet({ apiKey: '' });
const composio = toolset.client;

const appIntegrationIds = {
    "TWITTER": process.env.TWITTER_INTEGRATION_ID,
    "GITHUB": process.env.GITHUB_INTEGRATION_ID,
    "JIRA": process.env.JIRA_INTEGRATION_ID,
    "CLICKUP": process.env.CLICKUP_INTEGRATION_ID,
    "SHOPIFY": process.env.SHOPIFY_INTEGRATION_ID
};

export async function POST(request) {
    const { newUserId, admin_api_access_token, shopSubDomain, appName } = await request.json();
    try {
        const connectedAccount = await composio.connectedAccounts.initiate({
            integrationId: appIntegrationIds[appName],
            userUuid: newUserId,
            data:{
                "admin_api_access_token": admin_api_access_token,
                "shop": shopSubDomain
            }
        });
        console.log("\n\nconnectedAccount.connectionStatus :: ", connectedAccount);
        return NextResponse.json({
            authenticated: connectedAccount.connectionStatus === "ACTIVE" ? true : false,
        }, { status: 200});
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}