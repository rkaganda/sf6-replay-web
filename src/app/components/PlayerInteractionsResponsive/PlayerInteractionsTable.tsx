import { CFNReplayFrameData, CFNUser, MActionName, MoveNameMapping, PlayerInteraction, SF6Character } from "@/lib/types";
import PlayerInteractionRow from "./PlayerInteractionRow";

type PlayerInteractionsTableProps = {
    roundInteractions: PlayerInteraction[]; 
    snapToRoundFrame: (newRound: number, newFrame: number) => (void);
    characters: {[player: number]: SF6Character};
    replayFrames: { [frame: number]: {[player: number]: CFNReplayFrameData }},
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    cfnPlayers: {[player: number]: CFNUser},
    roundNumber: number
}

const PlayerInteractionTable = ({
    roundInteractions, 
    snapToRoundFrame, 
    characters, 
    replayFrames, 
    mActionNames,
    cfnPlayers,
    roundNumber
}: PlayerInteractionsTableProps) => {

    const snapToFrame = (newFrame: number) => {
        snapToRoundFrame(roundNumber, newFrame);
    }

    return (
        <div className="">
            <table className="table-fixed w-full border-collapse interaction-table">
                <tbody>
                    {roundInteractions.map((pInteraction: PlayerInteraction, index) => (
                        <PlayerInteractionRow
                            mActionNames={mActionNames} 
                            replayFrames={replayFrames}
                            characters={characters}
                            snapToFrame={snapToFrame}
                            playerInteraction={pInteraction} key={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PlayerInteractionTable;