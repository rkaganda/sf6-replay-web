'use client'
import { CFNReplay, MActionName, ReplayInteractions } from "../../../lib/types";
import PlayerInteractionTable from "./PlayerInteractionsTable";

type PlayerInteractionsTabProps = {
    currentRound: number;
    replayInteractions: ReplayInteractions
    snapToRoundFrame: (round: number, frame: number) => void;
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    cfnReplay: CFNReplay;
}

const PlayerInteractionsTab = ({ 
    currentRound, 
    snapToRoundFrame,
    mActionNames,
    replayInteractions,
    cfnReplay
}: PlayerInteractionsTabProps) => {

    const roundsKeys = Object.keys(replayInteractions.round)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div>
            <div className="tab-content">
                {roundsKeys.map((roundNumber) => (
                    <div
                        key={roundNumber+"_interaction"}
                        className={`pane ${currentRound === roundNumber ? "visible" : "hidden"}`}
                    >
                        <PlayerInteractionTable
                            cfnPlayers={cfnReplay.cfnPlayers}
                            mActionNames={mActionNames}
                            replayFrames={cfnReplay.replayData.replayRounds[roundNumber].frames}
                            roundNumber={roundNumber}
                            characters={cfnReplay.characters}
                            snapToRoundFrame={snapToRoundFrame} 
                            roundInteractions={replayInteractions.round[roundNumber]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerInteractionsTab;
