import ReplayInteractionsView from "@/app/components/ReplayInteractionsView";
import { getActStNames } from "@/lib/utils/server/actSt";
import { getCFNReplay } from "@/lib/utils/server/cfnReplays";
import { getMActionNames } from "@/lib/utils/server/mActionNames";
import { getReplayInteractions } from "@/lib/utils/server/replayInteractions";


export default async function Page({ params }: { params: Promise<{ cfn_replay_id: string }> }) {
    try {
        const { cfn_replay_id } = await params;
                const cfnReplay = await getCFNReplay(cfn_replay_id);
                const actStNames = await getActStNames();
                const mActionNames = {
                    0: await getMActionNames(Number(cfnReplay.info.characters[0].id)),
                    1: await getMActionNames(Number(cfnReplay.info.characters[1].id))
                }
                const replayInteractions = await getReplayInteractions(cfn_replay_id);
        
        return (
            <main>
                <div className="min-h-screen sm:p-2 font-[family-name:var(--font-geist-sans)]">
                    <ReplayInteractionsView
                        actStNames={actStNames}
                        mActionNames={mActionNames}
                        cfnReplay={cfnReplay}
                        replayInteractions={replayInteractions}
                    />
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error', error);
        return <div>Error loading replay data. Please try again later.</div>;
    }
}
