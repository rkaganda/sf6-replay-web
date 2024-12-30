import { MoveNameMapping, ActStName, MActionName, CFNReplayFrameData } from "@/lib/types";
import MoveMapping from "./MoveMapping";

type RelayFrameRowProps = {
    frame: number;
    handleRowClick: (frame: number) => (void);
    handleMoveMappingChange: (player: number, moveId: number, newMapping: MoveNameMapping) => (void);
    data: { [player: number]: CFNReplayFrameData };
    tableRound: number;
    moveMappings: { [player: number]: Map<number, MoveNameMapping> };
    actStNames: ActStName[];
    mActionNames: { 0: MActionName[]; 1: MActionName[]; };
}

const ReplayFrameRow = ({
    frame,
    handleRowClick,
    handleMoveMappingChange,
    data,
    moveMappings,
    actStNames,
    mActionNames
}: RelayFrameRowProps) => {
    const toNormalizeLowerCase = (str: string): string => {
        return str.charAt(0) + str.slice(1).toLowerCase();
    };

    const playerHeaders = [
        "drive",
        "super",
        "current_hp"
    ];

    return (
        <tr key={frame}
            onClick={() => handleRowClick(frame)}
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
                    className={`cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center ${header === 'drive'
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
                    className={`cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-center ${header === 'drive'
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
    )
};

export default ReplayFrameRow;