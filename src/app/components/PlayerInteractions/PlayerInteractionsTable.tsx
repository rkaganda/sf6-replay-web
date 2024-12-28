import { CFNReplayFrameData, MActionName, MoveNameMapping, PlayerInteraction, SF6Character } from "@/lib/types";
import PlayerInteractionRow from "./PlayerInteractionRow";

type PlayerInteractionsTableProps = {
    roundInteractions: PlayerInteraction[]; 
    handleFrameClick: (frame: number) => (void);
    characters: {[player: number]: SF6Character};
    replayFrames: { [frame: number]: {[player: number]: CFNReplayFrameData }},
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
}

const PlayerInteractionTable = ({roundInteractions, handleFrameClick, characters, replayFrames, mActionNames}: PlayerInteractionsTableProps) => {
    return (
        <div className="overflow-y-auto box-border h-80 w-128">
            <table className="table-fixed w-full border-collapse border border-gray-300">
                {/* Table Head */}
                <thead className="bg-gray-100 sticky top-0">
                    {/* First Header Row */}
                    <tr>
                        <th
                            colSpan={4}
                            className="text-center  bg-gray-200 font-bold"
                        >
                            Player 1
                        </th>
                        <th className="w-40 border border-gray-300 bg-gray-200 font-bold text-center">
                            Interaction
                        </th>
                        <th
                            colSpan={4}
                            className="text-center  bg-gray-200 font-bold"
                        >
                            Player 2
                        </th>
                    </tr>
                    {/* Second Header Row */}
                    <tr>
                        <th className=" text-center">HP</th>
                        <th className=" text-center">Drive</th>
                        <th className=" text-center">Super</th>
                        <th className=" text-center"></th>
                        <th className=" text-center">Time</th>
                        <th className=" text-center"></th>
                        <th className=" text-center">Super</th>
                        <th className=" text-center">Drive</th>
                        <th className=" text-center">HP</th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                    {roundInteractions.map((pInteraction: PlayerInteraction, index) => (
                        <PlayerInteractionRow
                            mActionNames={mActionNames} 
                            replayFrames={replayFrames}
                            characters={characters}
                            handleFrameClick={handleFrameClick}
                            playerInteraction={pInteraction} key={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PlayerInteractionTable;