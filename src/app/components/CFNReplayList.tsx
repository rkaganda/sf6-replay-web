import { getYoutubeCFNReplays } from "@/lib/utils/server/cfnReplays";

export default async function CFNReplayList() {
    try {
        const youtubeCFNReplays = await getYoutubeCFNReplays();

        return (
            <div className="grid grid-rows-[20px_1fr_20px] sm:p-2 font-[family-name:var(--font-geist-sans)]">
                {youtubeCFNReplays.map((youtubeCFNreplay) => (
                    <a  
                        key={youtubeCFNreplay.cfnReplayId} 
                        href={`/replay/timeline/${youtubeCFNreplay.cfnReplayId}`}>{`/replay/timeline/${youtubeCFNreplay.cfnReplayId}`}
                    </a>
                ))}
            </div>
        );
    } catch (error) {
        console.error("Error reading replay data:", error);
        return (
            <div>
                Error loading replay data. Please try again later.
            </div>
        );
    }
}
