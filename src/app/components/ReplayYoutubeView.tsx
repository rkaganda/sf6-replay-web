'use client';

import { useEffect, useState } from "react";

type ReplayYouTubeViewProps = {
    youtubeVideoID: string;
    currentSecond: number;
    onTimeUpdate: (currentTime: number) => void;
};

const ReplayYouTubeView = ({ youtubeVideoID, currentSecond, onTimeUpdate }: ReplayYouTubeViewProps) => {
    const [player, setPlayer] = useState<any>(null);
    const [playerPaused, setPlayerPause] = useState<boolean>(false);

    useEffect(() => {
        const scriptId = 'youtube-player-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = "https://www.youtube.com/player_api";
            script.id = scriptId;
            document.head.appendChild(script);
        }

        const onYouTubePlayerAPIReady = () => {
            const newPlayer = new (window as any).YT.Player('ytplayer', {
                height: '360',
                width: '640',
                videoId: youtubeVideoID,
                events: {
                    onReady: (event: any) => {
                        if (currentSecond >= 0) {
                            event.target.seekTo(currentSecond, true);
                        }
                    },
                    onStateChange: (event: any) => {
                        if (event.data === (window as any).YT.PlayerState.PLAYING) {
                            const interval = setInterval(() => {
                                const currentTime = Math.floor(newPlayer?.getCurrentTime() || 0);
                                onTimeUpdate(currentTime);
                                setPlayerPause(false)
                            }, 1000);

                            const stopInterval = () => clearInterval(interval);
                            newPlayer.addEventListener('onStateChange', (e: any) => {
                                if (e.data === (window as any).YT.PlayerState.ENDED) {
                                    stopInterval();
                                }
                            });
                        } 
                    },
                },
            });
            setPlayer(newPlayer);
        };

        (window as any).onYouTubePlayerAPIReady = onYouTubePlayerAPIReady;

        return () => {
            if (player) {
                player.destroy(); 
                setPlayer(null); // Ensure no lingering reference
            }
        };
    }, [youtubeVideoID]); 

    useEffect(() => {
        if (player && typeof player.getCurrentTime === "function" && typeof player.seekTo === "function") {
            if (currentSecond >= 0) {
                const currentTime = Math.floor(player.getCurrentTime());
                if (Math.abs(currentTime - currentSecond) > 0) {
                    const prevState:number = player.getPlayerState();
                    player.pauseVideo();
                    player.seekTo(currentSecond, true);
                    if (prevState===1 || prevState===3) {
                        player.playVideo();
                    }
                }
            }
        }
    }, [player, currentSecond]);

    return <div id="ytplayer"></div>;
};

export default ReplayYouTubeView;
