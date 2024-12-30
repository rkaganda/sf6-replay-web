type PlayerControlsProps = {
    toggleAutoscroll: () => void;
    autoScroll: boolean;
};

const PlayerControls = ({ toggleAutoscroll, autoScroll }: PlayerControlsProps) => {
    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleAutoscroll();
    };

    return (
        <div className="p-2">
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={handleToggle}
                    checked={autoScroll}
                />
                <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                <span className="ms-3 text-sm font-medium text-white">Autoscroll</span>
            </label>
        </div>
    );
};

export default PlayerControls;
