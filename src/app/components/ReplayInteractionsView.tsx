'use client'
import { ActStName, CFNReplay, MActionName, ReplayInteractions } from "@/lib/types";

import ReplayYouTubeView from "./ReplayYoutubeView";
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from "react";
import PlayerControls from "./ReplayTimeline/PlayerControls";
import PlayerInteractionsTab from "./PlayerInteractionsResponsive/PlayerInteractionsTab";
import RoundControls from "./ReplayTimeline/RoundControls";


type ReplayInteractionsViewProps = {
    actStNames: ActStName[]
    mActionNames: { 0: MActionName[]; 1: MActionName[]; }
    cfnReplay: CFNReplay,
    replayInteractions: ReplayInteractions
};

const ReplayInteractionsView = ({ actStNames, mActionNames, cfnReplay, replayInteractions }: ReplayInteractionsViewProps) => {
    const searchParams = useSearchParams();
    const roundKeys = Object.keys(cfnReplay.replayData.replayRounds)
        .map(Number)
        .sort((a, b) => a - b);
        

    const [playerTime, setPlayerTime] = useState<number>(0);
    const [currentFrame, setCurrentFrame] = useState<number>(0);
    const [playerFrame, setPlayerFrame] = useState<number>(0);
    const [currentRound, setRound] = useState<number>(0);
    const [autoScroll, setAutoScroll] = useState<boolean>(true);
    const autoScrollRef = useRef<boolean>(autoScroll);
    const [userControl, setUserControl] = useState<boolean>(false);
    const userControlRef = useRef(false);

    const playerStateRef = useRef<number>(-1);
    const playerActualTime = useRef<number>(0);


    const handePlayerUpdate = (newTime: number) => {
        if ((playerStateRef.current===1 || playerStateRef.current===3)) {
            playerActualTime.current = newTime;
            if(!userControlRef.current) {
                for (const roundNumber in cfnReplay.replayData.replayRounds) {
                    const range = cfnReplay.replayData.replayRounds[roundNumber].timings;
                    if (newTime >= range.startTime && newTime <= range.endTime) {
                        const offsetRatio = (newTime - range.startTime) / (range.endTime - range.startTime);
                        const playerFrame = Math.round(range.startFrame + ((range.endFrame - range.startFrame) * offsetRatio));
                        if (autoScrollRef.current) {
                            setRound(Number(roundNumber));
                        }
                        setPlayerFrame(playerFrame);
                        setPlayerTime(newTime)
                        break;
                    }
                }
            } else {
                setUserControl(false);
                userControlRef.current = false;
            }
        }
    };

    const calcuateNewSecondFromRoundFrame = (newRound: number, newFrame: number) => {
        const range = cfnReplay.replayData.replayRounds[newRound].timings;
        const offsetRatio = (newFrame - range.startFrame)/(range.endFrame - range.startFrame);
        const newSecond = Math.round(range.startTime + ((range.endTime - range.startTime)*offsetRatio));  
        return newSecond
    }

    const handlePlayerStateChange = (state: number) => {
        playerStateRef.current = state;
    };

    const handleTabClick = (roundNumber: number) => {
        setUserControl(true);
        userControlRef.current = true;
        setCurrentFrame(cfnReplay.replayData.replayRounds[roundNumber].timings.startFrame);
        setPlayerTime(cfnReplay.replayData.replayRounds[roundNumber].timings.startTime);
        setRound(roundNumber);
    };

    const handleFrameClick = (newFrame: number) => {
        console.trace();
        setUserControl(true);
        userControlRef.current = true;

        setCurrentFrame(newFrame)
        if (!autoScroll) {
            const newPlayerTime = calcuateNewSecondFromRoundFrame(currentRound, newFrame);

            setPlayerTime(newPlayerTime)
        }
    }

    const snapToRoundFrame = (newRound: number, newFrame: number) => {
        setUserControl(true);
        userControlRef.current = true;
        setCurrentFrame(newFrame)
        setPlayerTime(calcuateNewSecondFromRoundFrame(newRound, newFrame))
    }

    const handleShareClick = () => {
        const currentUrl = window.location.href.split('?')[0]; 
        const shareUrl = `${currentUrl}?t=${playerTime}`; 
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy the link.');
            });
    };

    const toggleAutoscroll = () => {
        setAutoScroll(!autoScroll)
    }

    useEffect(() => {
        autoScrollRef.current = autoScroll;
    }, [autoScroll]);

    useEffect(() => {
        if(autoScrollRef.current) {
            setCurrentFrame(playerFrame)
        }
    }, [playerFrame])


    useEffect(() => {
        if (userControl) {
            const timer = setTimeout(() => {
                setUserControl(false);
                userControlRef.current = false;
            }, 1100); 
            return () => clearTimeout(timer);
        }
    }, [currentRound, currentFrame, userControl])
    
    return (
        <div className="p-2 h-screen flex flex-col">
            <div>
                <div className="w-full max-w-3xl mx-auto">
                    <ReplayYouTubeView 
                        youtubeVideoID={cfnReplay.replayData.youtubeVideoId} 
                        playerTime={playerTime}
                        playerActualTime={playerActualTime} 
                        onTimeUpdate={handePlayerUpdate}
                        onPlayerStateChange={handlePlayerStateChange}
                    />
                </div>
                <div className="w-full max-w-3xl mx-auto">
                    <PlayerControls 
                        toggleAutoscroll={toggleAutoscroll}
                        autoScroll={autoScroll}
                    />
                </div>
            </div>
            <div className="w-full max-w-3xl mx-auto">
                    <RoundControls 
                        roundKeys={roundKeys}
                        currentRound={currentRound} 
                        handleTabClick={handleTabClick}           
                    />
                    <button onClick={handleShareClick}>Share</button>
                </div>
                <div className="w-full max-w-3xl mx-auto flex-1 overflow-auto">
                <PlayerInteractionsTab
                    cfnReplay={cfnReplay}
                    mActionNames={mActionNames}
                    currentRound={currentRound}
                    snapToRoundFrame={snapToRoundFrame} 
                    replayInteractions={replayInteractions}   
                />
            </div> 
        </div>
    );
};

export default ReplayInteractionsView;
