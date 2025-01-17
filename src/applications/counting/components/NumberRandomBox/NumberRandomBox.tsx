import React from "react";

type NumberRandomBoxProps = {
    number: number;
};

const NumberRandomBox = (props: NumberRandomBoxProps) => {
    const { number } = props;

    return <div style={{fontSize: "15rem"}}>
        <label>{number}</label>
    </div>
};

export default NumberRandomBox;