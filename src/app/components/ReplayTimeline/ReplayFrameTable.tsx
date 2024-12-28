import { useState, useRef, useEffect } from "react";
import {
    CFNReplayRounds,
    RoundTimeRanges,
    CFNReplayFrameData,
    SF6Character,
    CFNUser,
    MoveNameMapping,
    ActStName,
    MActionName,
} from "@/lib/types";
import MoveMapping from "./MoveMapping";
import { updateMoveMapping } from "@/lib/utils/client/moveMappings";

type ReplayTimelineTableProps = {
    roundData: CFNReplayRounds;
    activeFrame: number;
    tableRound: number;
    characters: { [player: number]: SF6Character };
    cfnPlayers: { [player: number]: CFNUser };
    roundTiming: RoundTimeRanges;
    handleFrameClick: (tableRound: number, currentFrame: number) => void;
    actStNames: ActStName[];
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
};

const ROW_HEIGHT = 20;
const VIEWPORT_HEIGHT = 400;
const VIEWPORT_WIDTH = 1600 + 70;

const ReplayTimelineTable = ({
    roundData,
    tableRound,
    activeFrame,
    handleFrameClick,
    roundTiming,
    characters,
    cfnPlayers,
    actStNames,
    mActionNames
}: ReplayTimelineTableProps) => {
    const [moveMappings, setMoveMappings] = useState<{
        [player: number]: Map<number, MoveNameMapping>;
    }>({
        0: characters[0]?.moveMapping || new Map(),
        1: characters[1]?.moveMapping || new Map(),
    });

    const [startIndex, setStartIndex] = useState(0);

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef<HTMLTableElement | null>(null);

    const totalFrames = Object.keys(roundData.frames).length;
    const framesArray = Object.keys(roundData.frames).map((key) => {
        const frame = parseInt(key, 10);
        return { frame, data: roundData.frames[frame] };
    });
    const rowsPerPage = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
    const endIndex = Math.min(startIndex + rowsPerPage, totalFrames);
    const visibleFrames = framesArray.slice(startIndex, endIndex);
    const tableFrameBacktrack: number = 190;

    const playerHeaders = [
        "drive",
        "super",
        "current_hp"
    ];
    const toNormalizeLowerCase = (str: string): string => {
        return str.charAt(0) + str.slice(1).toLowerCase();
    };

    const onScroll = () => {
        if (viewportRef.current) {
            const scrollTop = viewportRef.current.scrollTop;
            const newStartIndex = Math.floor(scrollTop / ROW_HEIGHT);
            setStartIndex(newStartIndex);
        }
    };

    useEffect(() => {
        if (viewportRef.current) {
            const targetIndex = Math.max(0, activeFrame - roundTiming.startFrame - Math.floor(rowsPerPage / 3));
            const scrollTop = targetIndex * ROW_HEIGHT;
            viewportRef.current.scrollTop = scrollTop;
            setStartIndex(targetIndex);
        }
    }, [activeFrame, roundTiming.startFrame, rowsPerPage]);

    const handleMoveMappingChange = async (player: number, moveId: number, newMapping: MoveNameMapping) => {
        setMoveMappings((prev) => {
            const updatedMappings = new Map(prev[player]);
            updatedMappings.set(moveId, newMapping);

            return {
                ...prev,
                [player]: updatedMappings,
            };
        });

        const newMoveName = newMapping.moveName;
        if (newMoveName) {
            await updateMoveMapping(moveId, newMoveName);
        }
    };

    return (
        <div>
            {/* Duplicate Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <table className="table-fixed w-full"
                    style={{
                        // height: `${VIEWPORT_HEIGHT}px`,
                        // overflowY: "auto",
                        // overflowX: "auto",
                        // position: "relative",
                        // TODO adjust for scollbar width
                        width: `${VIEWPORT_WIDTH-20}px`,
                    }}
                >
                    <thead>
                        <tr>
                            <th colSpan={13}>
                                {cfnPlayers[0]?.cfnNames[0] || "Player 1"} - {characters[0]?.name || "Unknown"}
                            </th>
                            <th colSpan={12} >
                                {cfnPlayers[1]?.cfnNames[0] || "Player 2"} - {characters[1]?.name || "Unknown"}
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={2}>move</th>
                            <th colSpan={2}>state</th>
                            <th colSpan={2}>action</th>
                            {playerHeaders.map((header) => (
                                <th key={`p1-${header}`} colSpan={2} >
                                    {header}
                                </th>
                            ))}
                            <th colSpan={1}>Timer</th>
                            <th colSpan={2}>move</th>
                            <th colSpan={2}>state</th>
                            <th colSpan={2}>action</th>
                            {playerHeaders.map((header) => (
                                <th key={`p2-${header}`} colSpan={2} >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
            </div>
    
            {/* Scrollable Table */}
            <div
                ref={viewportRef}
                onScroll={onScroll}
                style={{
                    height: `${VIEWPORT_HEIGHT}px`,
                    overflowY: "auto",
                    // overflowX: "auto",
                    position: "relative",
                    width: `${VIEWPORT_WIDTH}px`,
                }}
            >
                <div
                    style={{
                        height: `${totalFrames * ROW_HEIGHT}px`,
                        position: "relative",
                    }}
                >
                    <table
                        className="table-fixed absolute w-full"
                        ref={tableRef}
                        style={{
                            position: "absolute",
                            top: `${startIndex * ROW_HEIGHT}px`,
                            //width: `${VIEWPORT_WIDTH}px`,
                        }}
                    >
                        <thead style={{ visibility: 'hidden'}}>
                            <tr style={{ visibility: 'hidden'}}>
                            {/* <thead >
                            <tr > */}
                                <th colSpan={2} >move</th>
                                <th colSpan={2}>state</th>
                                <th colSpan={2} >action</th>
                                {playerHeaders.map((header) => (
                                    <th key={`p1-${header}`} colSpan={2}>
                                        {header}
                                    </th>
                                ))}
                                <th colSpan={1}>Timer</th>
                                <th colSpan={2}>move</th>
                                <th colSpan={2}>state</th>
                                <th colSpan={2}>action</th>
                                {playerHeaders.map((header) => (
                                    <th key={`p2-${header}`} colSpan={2}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Table Body */}
                            {visibleFrames.map(({ frame, data }) => (
                                <tr key={frame}
                                    onClick={() => handleFrameClick(tableRound, frame-tableFrameBacktrack)}
                                >
                                    <td
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center"
                                        colSpan={2}
                                    >
                                        <MoveMapping
                                            moveId={data[0].move_mapping_id}
                                            characterMoveMappings={moveMappings[0]}
                                            onMappingChange={(newMapping) => handleMoveMappingChange(0, data[0].move_mapping_id, newMapping)}
                                        />
                                    </td>
                                    <td
                                        key={`p0-${frame}-state`}
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center"
                                        colSpan={2}
                                        
                                    >
                                        {toNormalizeLowerCase(
                                            actStNames.find((actStName: ActStName) => actStName.id === data[0].act_st)?.name?.toString() ||
                                            data[0]?.act_st.toString()
                                        )}
                                    </td>
                                    <td
                                        key={`p0-${frame}-action-name`}
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center"
                                        colSpan={2}
                                        
                                    >
                                        {toNormalizeLowerCase(
                                            mActionNames[0].find((mActionName: MActionName) => mActionName.id === data[0].mactionid)?.name?.toString() ||
                                            "id: " + data[0]?.mactionid.toString()
                                        )}
                                    </td>
                                    {playerHeaders.map((header) => (
                                        <td
                                            key={`p0-${frame}-${header}`}
                                            colSpan={2}
                                            className={`cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center ${
                                                header === 'drive'
                                                  ? 'text-green-500'
                                                  : header === 'super'
                                                  ? 'text-blue-500'
                                                  : header === 'current_hp'
                                                  ? 'text-red-500'
                                                  : ''
                                              }`}
                                            
                                        >
                                            {data[0]?.[header as keyof CFNReplayFrameData]?.toString().substring(0, 4)}
                                        </td>
                                    ))}
                                    <td
                                        colSpan={1}
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center"
                                    >
                                        {data[0]?.round_timer || "-"}
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center"
                                    >
                                        <MoveMapping
                                            moveId={data[1].move_mapping_id}
                                            characterMoveMappings={moveMappings[1]}
                                            onMappingChange={(newMapping) => handleMoveMappingChange(1, data[1].move_mapping_id, newMapping)}
                                        />
                                    </td>
                                    <td
                                        key={`p1-${frame}-state`}
                                        colSpan={2}
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center"
                                        
                                    >
                                        {toNormalizeLowerCase(
                                            actStNames.find((actStName: ActStName) => actStName.id === data[1].act_st)?.name?.toString() ||
                                            data[1]?.act_st.toString()
                                        )}
                                    </td>
                                    <td
                                        key={`p1-${frame}-action-name`}
                                        colSpan={2}
                                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center truncate-text"
                                        
                                    >
                                        {toNormalizeLowerCase(
                                            mActionNames[1].find((mActionName: MActionName) => mActionName.id === data[1].mactionid)?.name?.toString() ||
                                            "id: " + data[1]?.mactionid.toString()
                                        )}
                                    </td>
                                    {playerHeaders.map((header) => (
                                        <td
                                            key={`p1-${frame}-${header}`}
                                            colSpan={2}
                                            className={`cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center ${
                                                header === 'drive'
                                                  ? 'text-green-500'
                                                  : header === 'super'
                                                  ? 'text-blue-500'
                                                  : header === 'current_hp'
                                                  ? 'text-red-500'
                                                  : ''
                                              }`}
                                            
                                        >
                                            {data[1]?.[header as keyof CFNReplayFrameData]?.toString().substring(0, 4)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );    
};

export default ReplayTimelineTable;
