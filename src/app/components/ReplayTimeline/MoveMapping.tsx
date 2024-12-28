import { MoveNameMapping } from '@/lib/types';


type MoveMappingProps = {
    moveId: number,
    characterMoveMappings: Map<number, MoveNameMapping>;
    onMappingChange: (newMapping: MoveNameMapping, moveId: number) => void
};

const MoveMapping = ({ moveId, characterMoveMappings, onMappingChange }: MoveMappingProps) => {
    const onMoveNameChange = (newMoveName: string) => {
        const move = characterMoveMappings.get(moveId);
    
        if (move && newMoveName !== move.moveName) {
            onMappingChange({ ...move, moveName: newMoveName }, moveId);
        } else if (!move) {
            console.warn(`Move with ID ${moveId} not found in characterMoveMappings.`);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const inputElement = event.target as HTMLInputElement;
            onMoveNameChange(inputElement.value);
        }
    };

    return (
        <div>
            <input list="move-options" 
                //value={moveMapping ? (moveMapping.moveName):('')}
                onBlur={(e) => onMoveNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                defaultValue={characterMoveMappings.get(moveId)?.moveName || ("")}
                className="w-full max-w-full box-border overflow-hidden text-ellipsis"
            />
            {/* <datalist id="move-options">
                {Object.values(characterMoveMappings).map((mapping) => (
                    mapping.moveName.length > 0 && (
                        <option key={mapping.id} value={mapping.moveName}>
                            {mapping.moveName}
                        </option>
                    )
                ))}
            </datalist> */}
        </div>
    );
};

export default MoveMapping;