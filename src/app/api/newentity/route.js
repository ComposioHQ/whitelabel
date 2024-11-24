import { NextResponse } from 'next/server';
import { Composio } from "composio-core";

const appIntegrationIds = {
    "TWITTER": process.env.TWITTER_INTEGRATION_ID,
    "GITHUB": process.env.GITHUB_INTEGRATION_ID,
    "JIRA": process.env.JIRA_INTEGRATION_ID,
    "CLICKUP": process.env.CLICKUP_INTEGRATION_ID
};

export async function POST(request) {
    const { newUserId, redirectUrl, appName } = await request.json();
    const client = new Composio(process.env.COMPOSIO_API_KEY);
    try {
        const entity = await client.getEntity(newUserId);
        const connection = await entity.initiateConnection(appName.toLowerCase(), undefined, undefined, redirectUrl, appIntegrationIds[appName]);
        console.log("\n\nconnection", connection);
        return NextResponse.json({
            authenticated: "no",
            message: `User ${newUserId} is not yet authenticated with ${appName}. Please authenticate.`,
            url: connection.redirectUrl
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
