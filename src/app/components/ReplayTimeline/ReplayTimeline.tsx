'use client'
import { ActStName, CFNReplay, MActionName, ReplayInteractions } from "@/lib/types";
import { useState } from "react";
import ReplayYouTubeView from "../ReplayYoutubeView";
import ReplayDataTabsView from "./ReplayDataTabs";
import PlayerInteractionsTab from "../PlayerInteractions/PlayerInteractionsTab";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/compat/router'

type ReplayTimelineView = {
    actStNames: ActStName[]
    mActionNames: { 0: MActionName[]; 1: MActionName[]; }
    cfnReplay: CFNReplay,
    replayInteractions: ReplayInteractions
};

const ReplayTimelineView = ({ actStNames, mActionNames, cfnReplay, replayInteractions }: ReplayTimelineView) => {
    const searchParams = useSearchParams();
    const router = useRouter(); 
    const searchSeconds = Number(searchParams?.get('t')) || 0;

    const [currentSecond, setSeconds] = useState<number>(searchSeconds);
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

    const handleShareClick = () => {
        const currentUrl = window.location.href.split('?')[0]; 
        const shareUrl = `${currentUrl}?t=${currentSecond}`; 
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy the link.');
            });
    };
    
    return (
        <div>
            <div className="flex space-x-4">
                <div className="w-2/4">
                    <ReplayYouTubeView 
                        youtubeVideoID={cfnReplay.replayData.youtubeVideoId} 
                        currentSecond={currentSecond} 
                        onTimeUpdate={handleTimeUpdate}
                        
                    />
                </div>
                <button onClick={handleShareClick}>Share</button>
                <div className="w-3/4 pr-10">
                    <PlayerInteractionsTab
                        roundData={cfnReplay.replayData.replayRounds}
                        characters={cfnReplay.characters} 
                        actStNames={actStNames}
                        mActionNames={mActionNames}
                        currentFrame={currentFrame}
                        activeTab={currentRound}
                        handleFrameClick={handleFrameClick} 
                        replayInteractions={replayInteractions}   
                    />
                </div>
            </div>
            <div className="flex space-x-4">
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
        </div>
    );
};

export default ReplayTimelineView;
