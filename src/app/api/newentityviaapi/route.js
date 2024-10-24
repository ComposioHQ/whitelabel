import { NextResponse } from 'next/server';
import { Composio } from "composio-core";

const appIntegrationIds = {
    "TWITTER": process.env.TWITTER_INTEGRATION_ID,
    "GITHUB": process.env.GITHUB_INTEGRATION_ID,
    "JIRA": process.env.JIRA_INTEGRATION_ID,
    "CLICKUP": process.env.CLICKUP_INTEGRATION_ID
};

// export async function POST(request) {
//     const { newUserId, redirectUrl, appName } = await request.json();
//     const client = new Composio(process.env.COMPOSIO_API_KEY);
//     try {
//         const entity = await client.getEntity(newUserId);
//         const connection = await entity.initiateConnection({appName: appName.toLowerCase(), redirectUrl: redirectUrl, integrationId: appIntegrationIds[appName]});
//         const connectedAccount = await client.connectedAccounts.initiate({
//             integrationId: appIntegrationIds[appName],
//             userUuid: newUserId,
//             connected_account_params: { "admin_api_access_token": "","shop": ""}
//         });
//         console.log(connectedAccount.redirectUrl);
//         return NextResponse.json({
//             authenticated: "no",
//             message: `User ${newUserId} is not yet authenticated with ${appName}. Please authenticate.`,
//             url: connectedAccount.redirectUrl
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     }
// }


import { OpenAIToolSet } from 'composio-core';
const toolset = new OpenAIToolSet({ apiKey: '' });
const composio = toolset.client;



export async function POST(request) {
    const { newUserId, redirectUrl, appName } = await request.json();
    try {
        // const integration = await composio.integrations.get({ integrationId: '29121a15-5b6e-402c-bd4d-f9bdc9ff79d2' });
        // const expectedInputFields = await toolset.getExpectedParamsForUser({ integrationId: integration.id });
        // console.log(expectedInputFields);
        // const connectedAccount = await composio.connectedAccounts.initiate({
        //     // integrationId: integration.id,
        //     integrationId: appIntegrationIds[appName],
        //     userUuid: 'test_one_two_three',
        //     connected_account_params: { "admin_api_access_token": "", "shop": "" }
        // });
        const connectedAccount = await composio.connectedAccounts.initiate({
            integrationId: appIntegrationIds[appName],
            userUuid: 'abishkpatil',
            connected_account_params:{ "admin_api_access_token": "", "shop": "" }
        });
        console.log("\n\nconnectedAccount :: ", connectedAccount);
        // console.log(connectedAccount.redirectUrl);
        return NextResponse.json({
            authenticated: "no",
            message: `User ${newUserId} is not yet authenticated with ${appName}. Please authenticate.`,
            url: connectedAccount.redirectUrl
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}