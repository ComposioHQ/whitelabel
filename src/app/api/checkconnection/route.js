import { NextResponse } from 'next/server'
import { Composio, OpenAIToolSet } from "composio-core"

export async function POST(request) {
    try {
        const { appName, entityId } = await request.json();

        if (!appName || !entityId) {
            return NextResponse.json({ error: 'Missing appName or entityId' }, { status: 400 });
        }

        const isConnected = await checkConnection(appName, entityId);
        return NextResponse.json({ isConnected }, { status: 200 });
    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}


async function checkConnection(appName, entityId) {
    try {
        const client = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        const entity = await client.getEntity(entityId);
        if (!entity) {
            console.error(`Entity not found for entityId: ${entityId}`);
            return false;
        }
        try {
            const connectedAccounts = await entity.getConnection({ appName: appName.toLowerCase() });
        } catch (error) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}