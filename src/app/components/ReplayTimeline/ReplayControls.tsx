type ReplayControlsProps = {
    currentRound: number;
    roundKeys: number[];
    handleTabClick: (roundNumber: number) => (void)
}

const ReplayControls = ({currentRound, roundKeys, handleTabClick }: ReplayControlsProps) => {

    return (
        <div className="p-2">
            {roundKeys.map((roundNumber) => (
                <button
                    key={roundNumber}
                    className={`tab ${currentRound === roundNumber ? "active" : ""} font-bold py-2 px-4`}
                    onClick={() => handleTabClick(roundNumber)}
                >
                    Round {roundNumber+1}
                </button>
            ))}
        </div>
    )
}

export default ReplayControls;