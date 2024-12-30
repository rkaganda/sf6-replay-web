import { CFNReplayFrameData, MActionName, MoveNameMapping, PlayerInteraction, SF6Character } from "@/lib/types";

type PlayerInteractionRowProps = {
    playerInteraction: PlayerInteraction;
    snapToFrame: (newFrame: number) => void;
    characters: {[player: number]: SF6Character};
    replayFrames: { [frame: number]: {[player: number]: CFNReplayFrameData }};
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
}

const PlayerInteractionRow = ({ 
    playerInteraction, 
    snapToFrame,
    characters, 
    replayFrames, 
    mActionNames  
}: PlayerInteractionRowProps) => {
    const interactionStateBacktrack: number = 2;
    const interactionFrameBacktrack: number = 190;

    const toNormalizeLowerCase = (str: string): string => {
        return str.charAt(0) + str.slice(1).toLowerCase();
    };
    const appendSign = (value: number): string => {
        return value === 0 ? "-" : (value > 0 ? "+" + value.toString() : value.toString());
    }

    const getMoveName = (player: 0|1) => {
        const backtrackFrame = playerInteraction.start_frame-interactionStateBacktrack
        const moveName = characters[player].moveMapping.get(replayFrames[backtrackFrame][player].move_mapping_id)?.moveName;
        const mActionId = replayFrames[backtrackFrame][player].mactionid;
        const mActionName = getMActionName(mActionId, player);

        return (moveName?.length||0>0 ? moveName : mActionName)
    }

    const getMActionName = (mActionId: number, player: 0|1) => {
        return toNormalizeLowerCase(
            mActionNames[player].find((mActionName: MActionName) => mActionName.id === mActionId)?.name?.toString() ||
            "id: " + mActionId.toString()
        )
    };

    return (
        <tr 
            className="interaction-row"
            onClick={() => snapToFrame(playerInteraction.start_frame)}
        >
            {/* Player 1 Data */}
            <td className=" text-red-500 text-center">
                {appendSign(playerInteraction.change[0].hp_change)}
            </td>
            <td className=" text-green-500 text-center">
                {appendSign(playerInteraction.change[0].drive_change)}
            </td>
            <td className=" text-blue-500 text-center">
                {appendSign(playerInteraction.change[0].super_change)}
            </td>
            <td className="text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {/* {getMActionName(replayFrames[playerInteraction.start_frame-interactionStateBacktrack][0].mactionid, 0)} */}
                {getMoveName(0)}
            </td>
            {/* Interaction Data */}
            <td className=" text-center w-40">
                <div className="flex items-center justify-center">
                    {playerInteraction.target_player === 1 ? (
                        <>
                            <span className="mr-1">{'>>'}</span>
                            <span className="truncate">{playerInteraction.start_time}</span>
                            <span className="ml-1">{'>>'}</span>
                        </>
                    ) : (
                        <>
                            <span className="mr-1">{'<<'}</span>
                            <span className="truncate">{playerInteraction.start_time}</span>
                            <span className="ml-1">{'<<'}</span>
                        </>
                    )}
                </div>
            </td>
            {/* Player 2 Data */}
            <td className="text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {/* {getMActionName(replayFrames[playerInteraction.start_frame-interactionStateBacktrack][1].mactionid, 1)} */}
                {getMoveName(1)}
            </td>
            <td className=" text-blue-500 text-center">
                {appendSign(playerInteraction.change[1].super_change)}
            </td>
            <td className=" text-green-500 text-center">
                {appendSign(playerInteraction.change[1].drive_change)}
            </td>
            <td className=" text-red-500 text-center">
                {appendSign(playerInteraction.change[1].hp_change)}
            </td>
        </tr>
    )
}

export default PlayerInteractionRow