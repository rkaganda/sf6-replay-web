'use client';

import { useEffect, useState } from "react";

type ReplayYouTubeViewProps = {
    youtubeVideoID: string;
    currentSecond: number;
    onTimeUpdate: (currentTime: number) => void;
};

const ReplayYouTubeView = ({ youtubeVideoID, currentSecond, onTimeUpdate }: ReplayYouTubeViewProps) => {
    const [player, setPlayer] = useState<any>(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubePlayerAPIReady = () => {
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
                            }, 1000);

                            // Clear interval when playback ends
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

    }, [youtubeVideoID, onTimeUpdate, player]);

    useEffect(() => {
        if (player && typeof player.getCurrentTime === "function" && typeof player.seekTo === "function" && currentSecond >= 0) {
            const currentTime = Math.floor(player.getCurrentTime());
            if (Math.abs(currentTime - currentSecond) > 0) {
                player.seekTo(currentSecond, true);
            }
        }
    }, [player, currentSecond]);

    return <div id="ytplayer"></div>;
};

export default ReplayYouTubeView;
