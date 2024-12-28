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
    roundKeys: number[];
}

const ReplayDataTabsView = ({ 
    cfnReplay, 
    currentFrame, 
    activeTab, 
    handleTabClick, 
    handleFrameClick,
    actStNames,
    mActionNames,
    roundKeys,
}: ReplayDataTabsViewProps) => {

    return (
        <div>
            <div className="tab-content">
                {roundKeys.map((roundNumber) => (
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
        </div>
    );
};

export default ReplayDataTabsView;
