'use client';

import { useEffect, useState } from "react";
import { fetchCFNReplays } from "@/lib/utils/client/cfnReplays";
import { CFNReplayInfo } from "@/lib/types";
import CFNReplayItem from "./CFNReplayItem";

export default function CFNReplayList() {
    const [cfnReplays, setCfnReplays] = useState<CFNReplayInfo[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCFNReplays();
                setCfnReplays(data);
            } catch (err) {
                console.error("Error fetching replay data:", err);
                setError("Error loading replay data. Please try again later.");
            }
        };

        fetchData();
    }, []); 

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="grid gap-1 sm:p-2 row-span-3 font-[family-name:var(--font-geist-sans)] max-w-4xl mx-auto">
            {cfnReplays.map((cfnReplay) => (
                <CFNReplayItem key={cfnReplay.replayId} replay={cfnReplay} />
            ))}
        </div>
    );
}
