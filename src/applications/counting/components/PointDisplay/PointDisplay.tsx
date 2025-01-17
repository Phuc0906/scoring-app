import React from "react";

type PointDisplayProps = {
    points: number;
    color: 'blue' | 'red';
};

const PointDisplay = (props: PointDisplayProps) => {
    const { points, color } = props;
    
    return <div className={`w-3/12 h-fit bg-black flex flex-col items-center justify-center pt-3`}>
        <div className={`${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'} w-11/12 text-white text-center mb-12 py-5`}>
            <label>{color.toUpperCase()}</label>
        </div>
        <div className={`text-4xl ${color === 'blue' ? 'text-blue-600' : 'text-red-600'} h-44 pt-10`} style={{fontSize: "12rem"}}>
            <label>{points}</label>
        </div>
    </div>
};

export default PointDisplay;