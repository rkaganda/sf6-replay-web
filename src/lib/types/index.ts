export type ReplayData = {
    replayRounds: { [roundNumer: number]: CFNReplayRounds },
    youtubeVideoId: string
}

export type CFNReplayRounds = {
    frames: { [frame: number]: {[player: number]: CFNReplayFrameData }},
    timings: RoundTimeRanges
}

export type YoutubeCFNReplay = {
    cfnReplayId: string,
    youtubeVideoId: string
}

export type VideoReplayTiming = {
    round_number: number,
    round_start_time_seconds: number
}

export type RoundTimeRanges = {
    startFrame: number,
    endFrame: number,
    startTime: number,
    endTime: number
}

export type SF6Character = {
    id: number;
    name: string;
    moveMapping: Map<number, MoveNameMapping>;
};

export type CFNUser = {
    id: number,
    cfnNames: string[]
}

export type CFNReplay = {
    characters: { [player: number]: SF6Character },
    cfnPlayers: { [player: number]: CFNUser },
    replayData: ReplayData
}

export type CFNRawReplayData = {
    id: number;
    cfn_replay_id: string;
    frame: number;
    round_timer: number;
    round_number: number;
    p0_hp_cap: number;
    p0_hp_cooldown: number;
    p0_absolute_range: number;
    p0_act_st: number;
    p0_current_hp: number;
    p0_drive: number;
    p0_drive_cooldown: number;
    p0_input_data: number;
    p0_input_side: number;
    p0_mactionframe: number;
    p0_mactionid: number;
    p0_stance: number;
    p0_posx: number;
    p0_posy: number;
    p0_super: number;
    p0_blockstun: number;
    p0_hitstun: number;
    p0_move_id?: number;
    p1_hp_cap: number;
    p1_hp_cooldown: number;
    p1_absolute_range: number;
    p1_act_st: number;
    p1_current_hp: number;
    p1_drive: number;
    p1_drive_cooldown: number;
    p1_input_data: number;
    p1_input_side: number;
    p1_mactionframe: number;
    p1_mactionid: number;
    p1_stance: number;
    p1_posx: number;
    p1_posy: number;
    p1_super: number;
    p1_move_id?: number;
    p1_blockstun: number;
    p1_hitstun: number;
};

export type CFNReplayFrameData = {
    round_timer: number;
    hp_cap: number;
    hp_cooldown: number;
    absolute_range: number;
    act_st: number;
    current_hp: number;
    drive: number;
    drive_cooldown: number;
    input_data: number;
    input_side: number;
    mactionframe: number;
    mactionid: number;
    stance: number;
    posx: number;
    posy: number;
    super: number;
    blockstun: number;
    hitstun: number;
    move_mapping_id: number;
};

export type MoveNameMapping = {
    id: number;
    characterId: number;
    mActionId: number;
    actSt: number,
    moveName: string;
}

export type MActionName = {
    id: number
    name: string
}

export type ActStName = {
    id: number
    name: string
}

export type StanceName = {
    id: number
    name: string
}