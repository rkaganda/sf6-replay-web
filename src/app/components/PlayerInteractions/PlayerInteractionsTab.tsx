'use client'
import { ActStName, CFNReplay, CFNReplayRounds, MActionName, ReplayInteractions, SF6Character } from "../../../lib/types";
import PlayerInteractionTable from "./PlayerInteractionsTable";

type PlayerInteractionsTabProps = {
    currentFrame: number;
    activeTab: number;
    replayInteractions: ReplayInteractions
    handleFrameClick: (round: number, frame: number) => void;
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    cfnReplay: CFNReplay;
}

const PlayerInteractionsTab = ({ 
    currentFrame, 
    activeTab, 
    handleFrameClick,
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
                        className={`pane ${activeTab === roundNumber ? "visible" : "hidden"}`}
                    >
                        <PlayerInteractionTable
                            cfnPlayers={cfnReplay.cfnPlayers}
                            mActionNames={mActionNames}
                            replayFrames={cfnReplay.replayData.replayRounds[roundNumber].frames}
                            characters={cfnReplay.characters}
                            handleFrameClick = {(frame: number) => handleFrameClick(roundNumber, frame)} 
                            roundInteractions={replayInteractions.round[roundNumber]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerInteractionsTab;
