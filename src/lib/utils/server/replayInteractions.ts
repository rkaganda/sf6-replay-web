import prisma from "@/lib/db";
import { dbPlayerInteraction, PlayerInteraction, ReplayInteractions } from "../../types";

export const getReplayInteractions = async (cfn_replay_id: string): Promise<ReplayInteractions> => {
    try {        
        // TODO set to all HP if round end
        const db_player_interactions: dbPlayerInteraction[] = await prisma.$queryRaw`
            select
            hv.start_frame,
            hv.end_frame,
            hv.player_id as target_player,
            s_start.round_timer as "start_time",
            s_last.round_timer as "end_time",
            s_last.round_number as round_number,
            'hitstun'::text as "type",
            COALESCE(s_end.p0_current_hp, s_last.p0_current_hp) - COALESCE(s_start.p0_current_hp, 0) as p0_hp_change,
            COALESCE(s_end.p0_drive, s_last.p0_drive) - COALESCE(s_start.p0_drive, 0) as p0_drive_change,
            COALESCE(s_end.p0_super, s_last.p0_super) - COALESCE(s_start.p0_super, 0) as p0_super_change,
            COALESCE(s_end.p1_current_hp, s_last.p1_current_hp) - COALESCE(s_start.p1_current_hp, 0) as p1_hp_change,
            COALESCE(s_end.p1_drive, s_last.p1_drive) - COALESCE(s_start.p1_drive, 0) as p1_drive_change,
            COALESCE(s_end.p1_super, s_last.p1_super) - COALESCE(s_start.p1_super, 0) as p1_super_change
            from "hitstun_sequences_view" hv
            -- join for the state at (start_frame - 1)
            left join "cfn_raw_replays" s_start
            on  s_start.cfn_replay_id = hv.cfn_replay_id
            and s_start.round_number  = hv.round_number
            and s_start.frame         = hv.start_frame - 1

            -- join for the state at (end_frame + 1)
            left join "cfn_raw_replays" s_end
            on  s_end.cfn_replay_id = hv.cfn_replay_id
            and s_end.round_number  = hv.round_number
            and s_end.frame         = hv.end_frame + 1

            left join "cfn_raw_replays" s_last
            on  s_last.cfn_replay_id = hv.cfn_replay_id
            and s_last.round_number  = hv.round_number
            and s_last.frame         = hv.end_frame

            where hv.cfn_replay_id = ${cfn_replay_id}

            order by
            hv.start_frame, 
            hv.round_number,
            hv.sequence_id
        `
        const replayInteraction: ReplayInteractions = db_player_interactions.reduce((acc, mapping: dbPlayerInteraction) => {
            const roundNumber = mapping.round_number; 
        
            const interaction: PlayerInteraction = {
                change: {
                    0: {
                        hp_change: mapping.p0_hp_change,
                        drive_change: mapping.p0_drive_change,
                        super_change: mapping.p0_super_change,
                    },
                    1: {
                        hp_change: mapping.p1_hp_change,
                        drive_change: mapping.p1_drive_change,
                        super_change: mapping.p1_super_change,
                    },
                },
                target_player: mapping.target_player,
                start_frame: mapping.start_frame,
                end_frame: mapping.end_frame,
                start_time: mapping.start_time,
                end_time: mapping.end_time,
                type: mapping.type,
            };
        
            if (!acc.round[roundNumber]) {
                acc.round[roundNumber] = [];
            }
        
            acc.round[roundNumber].push(interaction);
        
            return acc;
        }, { round: {} } as ReplayInteractions);

        return replayInteraction
    } catch (error) {
        console.error("Error playerInteractions data:", error);
        throw new Error("Failed playerInteractions data.");
    }
};
