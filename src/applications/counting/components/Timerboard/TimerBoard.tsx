import React from "react";

type TimerBoardProps = {
    title: string;
    counter: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onCounterTrigger: () => void;
};

const TimerBoard = (props: TimerBoardProps) => {
    const { title, counter, onIncrement, onDecrement, onCounterTrigger } = props;

    return <div className="w-4/12 flex flex-col items-center justify-center py-2">
        <div className="text-3xl pt-5 font-bold text-red-600">
            <label>{title.toUpperCase()}</label>
        </div>
        <div className="w-full flex items-center justify-center gap-14">
            <div onClick={onDecrement} className="bg-pink-300 rounded-full p-2 cursor-pointer hover:bg-pink-50 active:bg-pink-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
            </div>
            <div onClick={onCounterTrigger} className="text-white cursor-pointer" style={{fontSize: "12rem"}}>
                <label className="bg-black px-8 cursor-pointer">{counter}</label>
            </div>
            <div onClick={onIncrement} className="bg-pink-300 rounded-full p-2 cursor-pointer hover:bg-pink-50 active:bg-pink-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>
        </div>
    </div>
};

export default TimerBoard;