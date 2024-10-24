import { NextResponse } from 'next/server';
import { createClickUpSpace } from '@/lib/actions/clickup';

export async function POST(request) {
    const { entity_id, workspace_id } = await request.json();
    const result = await createClickUpSpace(entity_id, workspace_id);
    
    if (result.status === 200) {
        return NextResponse.json({ message: result.message }, { status: 200 });
    } else if (result.status === 204) {
        return NextResponse.json({ message: result.message }, { status: 204 });
    } else {
        console.error("Error in POST /api/createclickupspace:", result.error);
        return NextResponse.json({ error: result.message }, { status: 500 });
    }
}
