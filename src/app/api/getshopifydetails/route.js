import { NextResponse } from 'next/server';
import { getShopDetails } from "@/lib/actions/shopify";

export async function POST(request) {
    const { entity_id } = await request.json();
    const result = await getShopDetails(entity_id);
    if (result.status === 200) {
        return NextResponse.json({ message: result.message }, { status: 200 });
    } else if (result.status === 204) {
        return NextResponse.json({ message: result.message }, { status: 204 });
    } else {
        console.error("Error in POST /api/getshopifydetails:", result.error);
        return NextResponse.json({ error: result.message }, { status: 500 });
    }
}
