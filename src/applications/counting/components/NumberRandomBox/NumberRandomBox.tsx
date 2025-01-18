import React from "react";

type NumberRandomBoxProps = {
    number: number;
};

const NumberRandomBox = (props: NumberRandomBoxProps) => {
    const { number } = props;

    return <div className="text-yellow-600" style={{fontSize: "15rem"}}>
        <label>{number}</label>
    </div>
};

export default NumberRandomBox;