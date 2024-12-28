import { CFNReplayFrameData, CFNUser, MActionName, MoveNameMapping, PlayerInteraction, SF6Character } from "@/lib/types";
import PlayerInteractionRow from "./PlayerInteractionRow";

type PlayerInteractionsTableProps = {
    roundInteractions: PlayerInteraction[]; 
    handleFrameClick: (frame: number) => (void);
    characters: {[player: number]: SF6Character};
    replayFrames: { [frame: number]: {[player: number]: CFNReplayFrameData }},
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    cfnPlayers: {[player: number]: CFNUser}
}

const PlayerInteractionTable = ({
    roundInteractions, 
    handleFrameClick, 
    characters, 
    replayFrames, 
    mActionNames,
    cfnPlayers
}: PlayerInteractionsTableProps) => {
    return (
        <div className="overflow-y-auto box-border h-80 w-128">
            <table className="table-fixed w-full border-collapse interaction-table">
                {/* Table Head */}
                <thead className="sticky top-0">
                    {/* First Header Row */}
                    <tr>
                        <th
                            colSpan={4}
                            className="text-center font-bold"
                        >
                            {cfnPlayers[0]?.cfnNames[0] || "Player 1"} - {characters[0]?.name || "Unknown"}
                        </th>
                        <th className="w-40 font-bold text-center">
                           
                        </th>
                        <th
                            colSpan={4}
                            className="text-center font-bold"
                        >
                            {cfnPlayers[1]?.cfnNames[0] || "Player 1"} - {characters[1]?.name || "Unknown"}
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