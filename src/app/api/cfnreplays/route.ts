import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const characterName = searchParams.get('characterName') || undefined;
    const cfnUserIdParam = searchParams.get('cfnUserId') || undefined;
    const cfnName = searchParams.get('cfnName') || undefined;

    const cfnUserId = cfnUserIdParam ? Number(cfnUserIdParam) : undefined;

    const whereClause: any = { AND: [] };

    if (cfnUserId) {
        whereClause.AND.push({
            OR: [
                { player_0_id: cfnUserId },
                { player_1_id: cfnUserId },
            ],
        });
    }

    if (characterName) {
        whereClause.AND.push({
            OR: [
                {
                    sf6_characters_cfn_replays_player_0_character_idTosf6_characters: {
                        name: characterName,
                    },
                },
                {
                    sf6_characters_cfn_replays_player_1_character_idTosf6_characters: {
                        name: characterName,
                    },
                },
            ],
        });
    }

    if (cfnName) {
        whereClause.AND.push({
            OR: [
                {
                    cfn_users_cfn_replays_player_0_idTocfn_users: {
                        cfn_user_names: {
                            some: { cfn_name: cfnName },
                        },
                    },
                },
                {
                    cfn_users_cfn_replays_player_1_idTocfn_users: {
                        cfn_user_names: {
                            some: { cfn_name: cfnName },
                        },
                    },
                },
            ],
        });
    }

    try {
        const replays = await prisma.cfn_replays.findMany({
            where: whereClause,
            include: {
                sf6_characters_cfn_replays_player_0_character_idTosf6_characters: true,
                sf6_characters_cfn_replays_player_1_character_idTosf6_characters: true,
                cfn_users_cfn_replays_player_0_idTocfn_users: {
                    include: { cfn_user_names: true },
                },
                cfn_users_cfn_replays_player_1_idTocfn_users: {
                    include: { cfn_user_names: true },
                },
            },
        });

        const results = replays.map((replay) => {
            return {
                replayId: replay.id,
                characters: {
                    0: {
                        id: replay.player_0_character_id,
                        name: replay.sf6_characters_cfn_replays_player_0_character_idTosf6_characters.name,
                        moveMapping: new Map<number, any>(),
                    },
                    1: {
                        id: replay.player_1_character_id,
                        name: replay.sf6_characters_cfn_replays_player_1_character_idTosf6_characters.name,
                        moveMapping: new Map<number, any>(),
                    },
                },
                cfnPlayers: {
                    0: {
                        id: Number(replay.player_0_id),
                        cfnNames: replay.cfn_users_cfn_replays_player_0_idTocfn_users.cfn_user_names.map(
                            (item) => item.cfn_name
                        ),
                    },
                    1: {
                        id: Number(replay.player_1_id),
                        cfnNames: replay.cfn_users_cfn_replays_player_1_idTocfn_users.cfn_user_names.map(
                            (item) => item.cfn_name
                        ),
                    },
                },
            };
        });

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error('api error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
