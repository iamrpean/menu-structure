import { NextResponse } from 'next/server';

const API_URL = process.env.NEST_PUBLIC_API_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!API_URL) {
            throw new Error('API URL is not defined');
        }

        const response = await fetch(`${API_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to create menu');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 },
        );
    }
}

// GET All Menus or Get by ID
export async function GET(request: Request) {
    try {
        if (!API_URL) {
            throw new Error('API URL is not defined');
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        let url = `${API_URL}/menu`;
        if (id) {
            url = `${API_URL}/menu/${id}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch menu${id ? ` with ID: ${id}` : 's'}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 },
        );
    }
}

// PUT (Update Menu by ID)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!API_URL) {
            throw new Error('API URL is not defined');
        }

        if (!id) {
            throw new Error('Menu ID is required for update');
        }

        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update menu with ID: ${id}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 },
        );
    }
}

// DELETE (Remove Menu by ID)
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!API_URL) {
            throw new Error('API URL is not defined');
        }

        if (!id) {
            throw new Error('Menu ID is required for deletion');
        }

        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE',
        });

        console.log(response)

        if (!response.ok) {
            throw new Error(`Failed to delete menu with ID: ${id}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 },
        );
    }
}

