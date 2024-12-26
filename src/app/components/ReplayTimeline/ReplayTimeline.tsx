'use client'
import { ActStName, CFNReplay, MActionName } from "@/lib/types";
import { useState } from "react";
import ReplayYouTubeView from "../ReplayYoutubeView";
import ReplayDataTabsView from "./ReplayDataTabs";

type ReplayTimelineView = {
    actStNames: ActStName[]
    mActionNames: { 0: MActionName[]; 1: MActionName[]; }
    cfnReplay: CFNReplay
};

const ReplayTimelineView = ({ actStNames, mActionNames, cfnReplay }: ReplayTimelineView) => {
    const [currentSecond, setSeconds] = useState<number>(0);
    const [currentFrame, setFrame] = useState<number>(0);
    const [currentRound, setRound] = useState<number>(0);

    const handleTimeUpdate = (newTime: number) => {
        for (const roundNumber in cfnReplay.replayData.replayRounds) {
            const range = cfnReplay.replayData.replayRounds[roundNumber].timings;
            if (newTime >= range.startTime && newTime <= range.endTime) {
                const offsetRatio = (newTime - range.startTime) / (range.endTime - range.startTime);
                const newFrame = Math.round(range.startFrame + ((range.endFrame - range.startFrame) * offsetRatio));
                setFrame(newFrame);
                setRound(Number(roundNumber));
                setSeconds(newTime);
                break;
            }
        }
    };

    const handleTabClick = (roundNumber: number) => {
        const newSeconds = Math.floor(cfnReplay.replayData.replayRounds[roundNumber].timings.startTime)
        setSeconds(newSeconds);
        setRound(roundNumber);
    };

    const handleFrameClick = (roundNumber: number, frame: number) => {
        const range = cfnReplay.replayData.replayRounds[roundNumber].timings;
        const offsetRatio = (frame - range.startFrame)/(range.endFrame - range.startFrame);
        const newSecond = Math.round(range.startTime + ((range.endTime - range.startTime)*offsetRatio));  
        setSeconds(newSecond);
        setRound(roundNumber);
    }
    
    return (
        <div>
            <ReplayYouTubeView youtubeVideoID={cfnReplay.replayData.youtubeVideoId} currentSecond={currentSecond} onTimeUpdate={handleTimeUpdate}/>
            <ReplayDataTabsView 
                actStNames={actStNames}
                mActionNames={mActionNames}
                cfnReplay={cfnReplay}
                currentFrame={currentFrame} 
                activeTab={currentRound} 
                handleTabClick={handleTabClick} 
                handleFrameClick={handleFrameClick}
                />
        </div>
    );
};

export default ReplayTimelineView;
