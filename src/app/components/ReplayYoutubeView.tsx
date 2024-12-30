'use client';

import { RefObject, useEffect, useRef, useState } from "react";

type ReplayYouTubeViewProps = {
    youtubeVideoID: string;
    playerTime: number;
    playerActualTime: RefObject<number>;
    onTimeUpdate: (currentTime: number) => void;
    onPlayerStateChange?: (state: number) => void;
};

const ReplayYouTubeView = ({ youtubeVideoID, playerTime, onTimeUpdate, onPlayerStateChange, playerActualTime }: ReplayYouTubeViewProps) => {
    const [player, setPlayer] = useState<any>(null);

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
                        if (playerTime >= 0) {
                            event.target.seekTo(playerTime, true);
                        }
                    },
                    onStateChange: (event: any) => {
                        if (onPlayerStateChange) {
                            onPlayerStateChange(event.data);
                        }
                        if (event.data === (window as any).YT.PlayerState.PLAYING) {
                            const currentTime = Math.floor(newPlayer?.getCurrentTime());
                            onTimeUpdate(currentTime);
                            const interval = setInterval(() => {
                                const currentTime = Math.floor(newPlayer?.getCurrentTime() || 0);
                                onTimeUpdate(currentTime);
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
                setPlayer(null);
            }
        };
    }, [youtubeVideoID]);

    useEffect(() => {
        if (player && typeof player.getCurrentTime === "function" && typeof player.seekTo === "function") {
            if (playerActualTime.current != playerTime) {
                player.seekTo(playerTime, true);
            }
        }
    }, [player, playerTime, playerActualTime.current]);

    return <div className="aspect-video">
        <div id="ytplayer" className="w-full h-full" >
        if player doesn&apos;t load, reload page
        </div>
    </div>;
};

export default ReplayYouTubeView;
