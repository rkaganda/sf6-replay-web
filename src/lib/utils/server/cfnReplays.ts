import prisma from "@/lib/db";
import { CFNReplayRounds, ReplayData, VideoReplayTiming, CFNReplay, SF6Character, CFNUser, CFNRawReplayData, MoveNameMapping } from "../../types";

export const getCFNReplay = async (cfnReplayId: string): Promise<CFNReplay> => {
    try {
        const cfnReplay = await prisma.cfn_replays.findUnique({
            where: { id: cfnReplayId },
        });

        if (!cfnReplay) {
            throw new Error(`CFN replay with ID ${cfnReplayId} not found.`);
        }

        const player0 = await prisma.cfn_users.findUnique({
            where: { id: cfnReplay.player_0_id },
            include: { cfn_user_names: true },
        });

        const player1 = await prisma.cfn_users.findUnique({
            where: { id: cfnReplay.player_1_id },
            include: { cfn_user_names: true },
        });

        if (!player0 || !player1) {
            throw new Error(`Players for replay ID ${cfnReplayId} not found.`);
        }

        const characters = [
            await prisma.sf6_characters.findUnique({
                where: { id: cfnReplay.player_0_character_id },
            }) || { id: cfnReplay.player_0_character_id, name: "" },
            await prisma.sf6_characters.findUnique({
                where: { id: cfnReplay.player_1_character_id },
            }) || { id: cfnReplay.player_1_character_id, name: "" }
        ];

        const [frameData, videoReplayTiming, youtubeVideoInfo] = await Promise.all([
            prisma.cfn_raw_replays.findMany({
                where: { cfn_replay_id: cfnReplayId },
                orderBy: { frame: "asc" },
            }),
            prisma.video_replay_timings.findMany({ where: { cfn_replay_id: cfnReplayId } }),
            prisma.youtube_video_replay.findUnique({ where: { cfn_replay_id: cfnReplayId } }),
        ]);

        const db_moveNameMappings = await prisma.move_name_mappings.findMany({
            where: {
                character_id: {
                    in: [Number(cfnReplay.player_0_character_id), Number(cfnReplay.player_1_character_id)],
                },
            },
        });
        
        const moveNameMappings = db_moveNameMappings.map((mapping: { id: any; character_id: any; m_action_id: any; act_st: any; move_name: any; }) => ({
            id: mapping.id,
            characterId: mapping.character_id,
            mActionId: mapping.m_action_id,
            actSt: mapping.act_st,
            moveName: mapping.move_name,
        }));

        const replayRounds: { [key: number]: CFNReplayRounds } = {};

        frameData.forEach((row: CFNRawReplayData) => {
            const roundNumber = row.round_number;
            [0, 1].forEach((player) => {

                if (!replayRounds[roundNumber]) {
                    const youtubeInfo = videoReplayTiming.find(
                        (info: VideoReplayTiming) => Number(info.round_number) === roundNumber
                    );

                    replayRounds[roundNumber] = {
                        frames: {},
                        timings: {
                            startFrame: 0,
                            endFrame: 0,
                            startTime: youtubeInfo?.round_start_time_seconds ?? 0,
                            endTime: 0,
                        },
                    };
                }

                if (!replayRounds[roundNumber].frames[row.frame]) {
                    replayRounds[roundNumber].frames[row.frame] = {};
                }

                replayRounds[roundNumber].frames[row.frame][player] = {
                    round_timer: row.round_timer, 
                    hp_cap: row[`p${player}_hp_cap` as `p${0 | 1}_hp_cap`],
                    hp_cooldown: row[`p${player}_hp_cooldown` as `p${0 | 1}_hp_cooldown`],
                    absolute_range: row[`p${player}_absolute_range` as `p${0 | 1}_absolute_range`],
                    act_st: row[`p${player}_act_st` as `p${0 | 1}_act_st`],
                    current_hp: row[`p${player}_current_hp` as `p${0 | 1}_current_hp`],
                    drive: row[`p${player}_drive` as `p${0 | 1}_drive`],
                    drive_cooldown: row[`p${player}_drive_cooldown` as `p${0 | 1}_drive_cooldown`],
                    input_data: row[`p${player}_input_data` as `p${0 | 1}_input_data`],
                    input_side: row[`p${player}_input_side` as `p${0 | 1}_input_side`],
                    mactionframe: row[`p${player}_mactionframe` as `p${0 | 1}_mactionframe`],
                    mactionid: row[`p${player}_mactionid` as `p${0 | 1}_mactionid`],
                    stance: row[`p${player}_stance` as `p${0 | 1}_stance`],
                    posx: row[`p${player}_posx` as `p${0 | 1}_posx`],
                    posy: row[`p${player}_posy` as `p${0 | 1}_posy`],
                    super: row[`p${player}_super` as `p${0 | 1}_super`],
                    hitstun: row[`p${player}_hitstun` as `p${0 | 1}_hitstun`],
                    blockstun: row[`p${player}_blockstun` as `p${0 | 1}_blockstun`],
                    move_mapping_id: moveNameMappings.find(
                        (mapping: MoveNameMapping) =>
                            mapping.actSt === row[`p${player}_act_st` as `p${0 | 1}_act_st`] &&
                            mapping.characterId === characters[0]?.id &&
                            mapping.mActionId === row[`p${player}_mactionid` as `p${0 | 1}_mactionid`]
                    )?.id
                };
            });
        });

        Object.values(replayRounds).forEach((round) => {
            const frameNumbers = Object.keys(round.frames).map(Number);
            const minFrame = Math.min(...frameNumbers);
            const maxFrame = Math.max(...frameNumbers);

            round.timings.startFrame = Math.min(round.timings.startFrame, minFrame);
            round.timings.endFrame = Math.max(round.timings.endFrame, maxFrame);
            const roundTimeLength = (round.timings.endFrame - round.timings.startFrame) / 60;
            round.timings.endTime = round.timings.startTime + roundTimeLength;
        });

        const replayData: ReplayData = {
            replayRounds,
            youtubeVideoId: youtubeVideoInfo?.youtube_video_id || "",
        };
        
        return {
            characters: {
                0: {
                    id: characters[0].id,
                    name: characters[0].name,
                    moveMapping: new Map(
                        moveNameMappings
                            .filter((mapping: MoveNameMapping) => mapping.characterId === characters[0].id)
                            .map((mapping: MoveNameMapping) => [mapping.id, mapping]) 
                    )
                },
                1: {
                    id: characters[1].id,
                    name: characters[1].name,
                    moveMapping: new Map(
                        moveNameMappings
                            .filter((mapping: MoveNameMapping) => mapping.characterId === characters[1].id)
                            .map((mapping: MoveNameMapping) => [mapping.id, mapping]) 
                    )
                },
            },
            cfnPlayers: {
                0: {
                    id: Number(player0.id),
                    cfnNames: player0.cfn_user_names.map((name: { cfn_name: string; }) => name.cfn_name),
                },
                1: {
                    id: Number(player1.id),
                    cfnNames: player1.cfn_user_names.map((name: { cfn_name: string; }) => name.cfn_name),
                },
            },
            replayData,
        };
    } catch (error) {
        console.error("Error fetching replay data:", error);
        throw new Error("Failed to fetch replay data.");
    }
};
