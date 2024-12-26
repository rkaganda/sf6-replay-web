'use client'
import { ActStName, CFNReplay, CFNReplayRounds, MActionName } from "../../../lib/types";
import ReplayTimelineTable from "./ReplayFrameTable";

type ReplayDataTabsViewProps = {
    cfnReplay: CFNReplay,
    currentFrame: number;
    activeTab: number;
    handleTabClick: (currentTime: number) => void;
    handleFrameClick: (round: number, frame: number) => void;
    actStNames: ActStName[];
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
}

const REplayDataTabsView = ({ 
    cfnReplay, 
    currentFrame, 
    activeTab, 
    handleTabClick, 
    handleFrameClick,
    actStNames,
    mActionNames
}: ReplayDataTabsViewProps) => {
    
    const roundsKeys = Object.keys(cfnReplay.replayData.replayRounds)
        .map(Number)
        .sort((a, b) => a - b);
        
    return (
        <div className="container mx-auto p-2">
            <div className="tabs">
                {roundsKeys.map((roundNumber) => (
                    <button
                        key={roundNumber}
                        className={`tab ${activeTab === roundNumber ? "active" : ""}`}
                        onClick={() => handleTabClick(roundNumber)}
                    >
                        Round {roundNumber}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {roundsKeys.map((roundNumber) => (
                    <div
                        key={roundNumber}
                        className={`pane ${activeTab === roundNumber ? "visible" : "hidden"}`}
                    >
                        <ReplayTimelineTable 
                            actStNames={actStNames}
                            mActionNames={mActionNames}
                            roundData={cfnReplay.replayData.replayRounds[roundNumber]}
                            roundTiming={cfnReplay.replayData.replayRounds[roundNumber].timings}
                            characters={cfnReplay.characters} 
                            cfnPlayers={cfnReplay.cfnPlayers} 
                            tableRound={roundNumber}
                            activeFrame={currentFrame} 
                            handleFrameClick={handleFrameClick}
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
        .tabs {
          class="inline-flex"
        }
        .tab {
          padding: 10px 20px;
          cursor: pointer;
          border: 1px solid #ccc;
          background: #f9f9f9;
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

export default REplayDataTabsView;
