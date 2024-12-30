'use client'
import { ActStName, CFNReplay, CFNReplayRounds, MActionName } from "../../../lib/types";
import ReplayTimelineTable from "./ReplayFrameTable";

type ReplayDataTabsViewProps = {
    cfnReplay: CFNReplay,
    currentFrame: number;
    currentRound: number;
    handleFrameClick: (frame: number) => void;
    actStNames: ActStName[];
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    roundKeys: number[];
    autoScroll: boolean;
}

const ReplayDataTabsView = ({ 
    cfnReplay, 
    currentFrame, 
    currentRound, 
    handleFrameClick,
    actStNames,
    mActionNames,
    roundKeys,
    autoScroll
}: ReplayDataTabsViewProps) => {

    return (
        <div>
            <div className="tab-content">
                {roundKeys.map((roundNumber) => (
                    <div
                        key={roundNumber}
                        className={`pane ${currentRound === roundNumber ? "visible" : "hidden"}`}
                    >
                        <ReplayTimelineTable 
                            actStNames={actStNames}
                            mActionNames={mActionNames}
                            roundData={cfnReplay.replayData.replayRounds[roundNumber]}
                            roundTiming={cfnReplay.replayData.replayRounds[roundNumber].timings}
                            characters={cfnReplay.characters}
                            cfnPlayers={cfnReplay.cfnPlayers}
                            tableRound={roundNumber}
                            currentFrame={currentFrame}
                            handleFrameClick={handleFrameClick}
                            autoScroll={autoScroll} 
                            currentRound={currentRound}                        
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReplayDataTabsView;
