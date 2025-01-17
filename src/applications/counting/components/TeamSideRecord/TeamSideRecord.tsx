import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Utils } from "../../utils/utils";
import { TimerConstants } from "../../constants";

type TeamSideRecordProps = {
    point: number[];
    triggerNumber: number;
    color: 'blue' | 'red';
};

const TeamSideRecord = (props: TeamSideRecordProps) => {
    const { point, triggerNumber, color } = props;
    const [blinking, setBlinking] = useState<number | undefined>(undefined);
    const [teamPoint, setTeamPoint] = useState<number>(0);

    const valueArray = useMemo(() => {
        return [1, 2, 3, 4];
    }, []);

    useEffect(() => {
        console.log('Triggering point change: ', Utils.countSum(point));
        setTeamPoint(Utils.countSum(point));
    }, [point]);

    useEffect(() => {
        // Listener should be here
        if (triggerNumber !== undefined) {
            console.log('Blink')
            setBlinking(triggerNumber);
            const timeout = setTimeout(() => setBlinking(undefined), TimerConstants.BLINK_INTERVAL); // Reset after 0.5s
            return () => clearTimeout(timeout); // Cleanup timeout
        }
    }, [triggerNumber])

    const renderPoint = useCallback(() => {
        return <div className="flex flex-row items-center justify-between w-full">
            {valueArray.map(value => {
                return <div key={value} className={` px-5 py-2 text-2xl text-white rounded-xl ${
                        blinking === value ? `bg-yellow-400` : `${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`
                    }`}>
                    <label>{value}</label>
                </div>
            })}
        </div>
    }, [blinking, color, valueArray])

    return <div className="w-fit h-fit flex flex-col gap-2 items-center justify-center ">
        <div className={`w-fit text-black bg-white px-32 text-center border-2 ${color === 'blue' ? 'border-blue-600' : 'border-red-600'} rounded-3xl`} style={{fontSize: "8rem"}}>
            <label>{teamPoint}</label>
        </div>
        {renderPoint()}
    </div>
};

export default TeamSideRecord;