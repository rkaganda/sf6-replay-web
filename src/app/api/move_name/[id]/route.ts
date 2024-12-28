import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const moveMapping = await prisma.move_name_mappings.findUnique({
            where: { id: Number(id) },
        });

        if (!moveMapping) {
            return NextResponse.json(null, { status: 404 });
        }
        return NextResponse.json(moveMapping, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: "Method not supported" }, { status: 405 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // TODO
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip');

    const fixed_ip = ip?.trim()
    const allowedIp = process.env.ALLOWED_IP;

    if (fixed_ip != allowedIp && fixed_ip!='::1') {
        return NextResponse.json({ error: "Method not supported" }, { status: 405 });
    }else {
        const { id } = await params;

        try {
            const body = await request.json();
            const { moveName } = body;

            if (!moveName) {
                return NextResponse.json({ error: "Missing moveName in request body" }, { status: 400 });
            }

            const updatedMapping = await prisma.move_name_mappings.update({
                where: { id: Number(id) },
                data: { move_name: moveName },
            });

            return NextResponse.json(updatedMapping, { status: 200 });
        } catch (error) {
            console.error("API error:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return NextResponse.json({ error: "Method not supported" }, { status: 405 });
    // const { id } = await params;

    // try {
    //     await prisma.move_name_mappings.delete({
    //         where: { id: Number(id) },
    //     });

    //     return NextResponse.json(null, { status: 204 });
    // } catch (error) {
    //     console.error("API error:", error);
    //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    // }
}
