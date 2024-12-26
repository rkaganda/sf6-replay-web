import ReplayTimelineView from '@/app/components/ReplayTimeline/ReplayTimeline';
import { getActStNames } from '@/lib/utils/server/actSt';
import { getCFNReplay } from '@/lib/utils/server/cfnReplays';
import { getMActionNames } from '@/lib/utils/server/mActionNames';

export default async function Page({ params }: { params: Promise<{ cfn_replay_id: string }> }) {
    try {
        const { cfn_replay_id } = await params;
        const cfnReplay = await getCFNReplay(cfn_replay_id);
        const actStNames = await getActStNames();
        const mActionNames = {
            0: await getMActionNames(Number(cfnReplay.characters[0].id)),
            1: await getMActionNames(Number(cfnReplay.characters[1].id))
        }
        
        return (
            <div className="grid grid-rows-[20px_1fr_20px]  min-h-screen sm:p-2 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col sm:items-start">
                <div>
                            <p>CFN Replay ID: {cfn_replay_id} YouTube Video ID: {cfnReplay.replayData.youtubeVideoId}</p>
                            <ReplayTimelineView 
                                actStNames={actStNames}
                                mActionNames={mActionNames}
                                cfnReplay={cfnReplay} 
                            />
                        </div>
                </main>
                <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                </footer>
            </div>    
        );
    } catch (error) {
        console.error('Error reading replay data:', error);
        return <div>Error loading replay data. Please try again later.</div>;
    }
}