'use client'
import { ActStName, CFNReplayRounds, MActionName, ReplayInteractions, SF6Character } from "../../../lib/types";
import PlayerInteractionTable from "./PlayerInteractionsTable";

type PlayerInteractionsTabProps = {
    currentFrame: number;
    activeTab: number;
    replayInteractions: ReplayInteractions
    handleFrameClick: (round: number, frame: number) => void;
    actStNames: ActStName[];
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    characters: {[player: number]: SF6Character};
    roundData: {[rounds: number]: CFNReplayRounds};
}

const PlayerInteractionsTab = ({ 
    currentFrame, 
    activeTab, 
    handleFrameClick,
    actStNames,
    mActionNames,
    characters,
    replayInteractions,
    roundData
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
                            mActionNames={mActionNames}
                            replayFrames={roundData[roundNumber].frames}
                            characters={characters}
                            handleFrameClick = {(frame: number) => handleFrameClick(roundNumber, frame)} 
                            roundInteractions={replayInteractions.round[roundNumber]}
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
        .tabs {
          class="inline-flex"
        }
        .tab.active {
          background: #ddd;
        }
        .pane {
          display: none;
        }
        .pane.visible {
          display: block;
        }
      `}</style>
        </div>
    );
};

export default PlayerInteractionsTab;
