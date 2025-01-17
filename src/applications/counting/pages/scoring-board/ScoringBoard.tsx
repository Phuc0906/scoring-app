import React from "react";
import PointDisplay from "../../components/PointDisplay/PointDisplay";
import TimerBoard from "../../components/Timerboard/TimerBoard";
import NumberRandomBox from "../../components/NumberRandomBox/NumberRandomBox";
import TeamSideRecord from "../../components/TeamSideRecord/TeamSideRecord";
import { useViewModel } from "./ScoringBoard.viewModel";

const ScoringBoard = () => {
    const { selectors, handlers } = useViewModel();

    return <div className="w-screen h-screen flex flex-col">
        <div className="w-full h-2/5 bg-yellow-300 py-2 px-4 flex items-center justify-between">
            <PointDisplay points={selectors.teamARecord} color="blue" />
            <TimerBoard title="Megaton Scoring" counter={selectors.count} onIncrement={handlers.increaseCounter} onDecrement={handlers.decreaseCounter} onCounterTrigger={handlers.onTriggerTimer}/>
            <PointDisplay points={selectors.teamBRecord} color="red" />
        </div>
        <div className="w-full h-1/4 bg-red-400 flex items-center justify-center">
            <NumberRandomBox number={selectors.randomNumber} />
        </div>
        <div className="w-full flex-1 bg-black flex items-center justify-between px-36">
            <TeamSideRecord point={selectors.teamAScore} triggerNumber={selectors.teamASelect} color="blue"/>
            <TeamSideRecord point={selectors.teamBScore} triggerNumber={selectors.teamBSelect} color="red"/>
        </div>
    </div>
};

export default ScoringBoard;