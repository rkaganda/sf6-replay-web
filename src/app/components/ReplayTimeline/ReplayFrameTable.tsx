import { useState, useRef, useEffect } from "react";
import {
    CFNReplayRounds,
    RoundTimeRanges,
    SF6Character,
    CFNUser,
    MoveNameMapping,
    ActStName,
    MActionName,
} from "@/lib/types";
import { updateMoveMapping } from "@/lib/utils/client/moveMappings";
import ReplayFrameRow from "./ReplayFrameRow";

type ReplayTimelineTableProps = {
    roundData: CFNReplayRounds;
    currentFrame: number;
    currentRound: number;
    tableRound: number;
    characters: { [player: number]: SF6Character };
    cfnPlayers: { [player: number]: CFNUser };
    roundTiming: RoundTimeRanges;
    handleFrameClick: (newFrame: number) => void;
    actStNames: ActStName[];
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
    autoScroll: boolean;
};

const ROW_HEIGHT = 26;
const VIEWPORT_HEIGHT = 400;
const VIEWPORT_WIDTH = 1600 + 70;

const ReplayTimelineTable = ({
    roundData,
    tableRound,
    currentFrame,
    currentRound,
    handleFrameClick,
    roundTiming,
    characters,
    cfnPlayers,
    actStNames,
    mActionNames,
    autoScroll,
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


    const playerHeaders = [
        "drive",
        "super",
        "current_hp"
    ];

    const onScroll = () => {
        if (viewportRef.current) {
            const scrollTop = viewportRef.current.scrollTop;
            const newStartIndex = Math.floor(scrollTop / ROW_HEIGHT);
            setStartIndex(newStartIndex);
        }
    };

    useEffect(() => {
        if (viewportRef.current) {
            const targetIndex = Math.max(0, currentFrame - roundTiming.startFrame);
            const minViewableFrame = startIndex;
            const maxViewableFrame = startIndex+rowsPerPage;
            if (targetIndex<startIndex || targetIndex>maxViewableFrame) {
                const scrollTop = targetIndex * ROW_HEIGHT;
                viewportRef.current.scrollTop = scrollTop;
                setStartIndex(targetIndex);
            }    
        }
    }, [currentFrame, rowsPerPage, roundTiming.startFrame]);

    useEffect(() => {
        if (currentRound===tableRound && viewportRef.current) {
            const scrollTop = viewportRef.current.scrollTop;
            const newStartIndex = Math.floor(scrollTop / ROW_HEIGHT);
            setStartIndex(newStartIndex);
        }
    },[currentRound]);


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
                        width: `${VIEWPORT_WIDTH - 20}px`,
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
                        <thead style={{ visibility: 'hidden' }}>
                            <tr style={{ visibility: 'hidden' }}>
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
                                <ReplayFrameRow
                                    key={frame}
                                    frame={frame}
                                    handleRowClick={handleFrameClick}
                                    handleMoveMappingChange={handleMoveMappingChange}
                                    data={data}
                                    tableRound={tableRound}
                                    moveMappings={moveMappings}
                                    actStNames={actStNames}
                                    mActionNames={mActionNames}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReplayTimelineTable;
