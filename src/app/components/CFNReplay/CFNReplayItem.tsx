"use client";

import React from "react";
import { CFNReplayInfo } from "@/lib/types";
import Link from "next/link";

type CFNReplayItemProps = {
    replay: CFNReplayInfo;
};

export default function CFNReplayItem({ replay }: CFNReplayItemProps) {
    return (
        <Link
            href={`/replay/timeline/${replay.replayId}`}
            className="tab flex flex-row items-center justify-around p-4 m-2 rounded-md transition-colors duration-200 bg-stone-900 hover:cursor-pointer hover:bg-stone-700 drop-shadow-xl"
        >
            {/* left player info */}
            <div className="flex flex-col items-center">
                <img
                    src={`/characters/56px-SF6_${replay.characters[0].name}_Icon.png`}
                    alt={replay.characters[0].name}
                    className="w-[56px] h-[56px]"
                />
                <p className="text-sm text-[rgba(255,255,255,0.9)] mt-2">
                    {replay.cfnPlayers[0].cfnNames[0] || "unknown"}
                </p>
                <p className="text-xs text-[rgba(255,255,255,0.7)]">
                    id: {replay.cfnPlayers[0].id}
                </p>
            </div>

            {/* middle vs info */}
            <div className="flex flex-col items-center">
                <p className="text-white font-bold text-xl">VS</p>
                <p className="text-xs text-[rgba(255,255,255,0.7)]">
                    {replay.replayId}
                </p>
            </div>

            {/* right player info */}
            <div className="flex flex-col items-center">
                <img
                    src={`/characters/56px-SF6_${replay.characters[1].name}_Icon.png`}
                    alt={replay.characters[1].name}
                    className="w-[56px] h-[56px]"
                />
                <p className="text-sm text-[rgba(255,255,255,0.9)] mt-2">
                    {replay.cfnPlayers[1].cfnNames[0] || "unknown"}
                </p>
                <p className="text-xs text-[rgba(255,255,255,0.7)]">
                    id: {replay.cfnPlayers[1].id}
                </p>
            </div>
        </Link>
    );
}
