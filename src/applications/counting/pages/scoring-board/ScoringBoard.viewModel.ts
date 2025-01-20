import { useCallback, useEffect, useRef, useState } from "react";
import { Utils } from "../../utils/utils";
import { BluetoothRemote } from "../../remote-data-source/BluetoothRemote";

const DEFAULT_COUNTER = 60;

export const useViewModel = () => {
    const [count, setCount] = useState(DEFAULT_COUNTER);
    const [isStartTimer, setIsStartTimer] = useState(false);
    const [randomNumber, setRandomNumber] = useState(0);
    const [teamAScore, setTeamAScore] = useState<number[]>([]);
    const [teamBScore, setTeamBScore] = useState<number[]>([]);
    const [teamARecord, setTeamARecord] = useState<number>(0);
    const [teamBRecord, setTeamBRecord] = useState<number>(0);
    const [teamASelect, setTeamASelect] = useState<number>(0);
    const [teamBSelect, setTeamBSelect] = useState<number>(0);
    const textDecoder = useRef(new TextDecoder("utf-8"));

    // Refs to store the latest state
    const isStartTimerRef = useRef(isStartTimer);
    const randomNumberRef = useRef(randomNumber);
    const teamAScoreRef = useRef(teamAScore);
    const teamBScoreRef = useRef(teamBScore);
    const teamARecordRef = useRef(teamARecord);
    const teamBRecordRef = useRef(teamBRecord);
    const teamASelectRef = useRef(teamASelect);
    const teamBSelectRef = useRef(teamBSelect);

    // Update refs whenever the state changes
    useEffect(() => {
        isStartTimerRef.current = isStartTimer;
    }, [isStartTimer]);

    useEffect(() => {
        randomNumberRef.current = randomNumber;
    }, [randomNumber]);

    useEffect(() => {
        teamAScoreRef.current = teamAScore;
    }, [teamAScore]);

    useEffect(() => {
        teamBScoreRef.current = teamBScore;
    }, [teamBScore]);

    useEffect(() => {
        teamARecordRef.current = teamARecord;
    }, [teamARecord]);

    useEffect(() => {
        teamBRecordRef.current = teamBRecord;
    }, [teamBRecord]);

    useEffect(() => {
        teamASelectRef.current = teamASelect;
    }, [teamASelect]);

    useEffect(() => {
        teamBSelectRef.current = teamBSelect;
    }, [teamBSelect]);

    const handleValueOnChange = (event: any) => {
        console.log("value on change: ", event);
        const decodedValue = textDecoder.current.decode(event); // Use the `textDecoder` ref
        const [side, selectPoint] = decodedValue.split(":");
        const point = parseInt(selectPoint) + 1;
    
        // Check if the timer is active using the ref
        if (!isStartTimerRef.current) {
            return;
        }
    
        if (side === "A") {
            console.log(`Received side: A and point: ${point}`);
    
            const tmpScore = [...teamAScoreRef.current]; // Use the ref for team A's current score
            const currentSum = Utils.countSum(tmpScore) + point;
    
            teamASelectRef.current = point; // Update ref for team A selection
            setTeamASelect(point); // Update state for UI rendering
    
            if (currentSum > randomNumberRef.current) {
                teamAScoreRef.current = []; // Reset ref value for team A's score
                setTeamAScore([]); // Update state
            } else if (currentSum === randomNumberRef.current) {
                teamAScoreRef.current = []; // Reset ref value for team A's score
                setTeamARecord((prev) => {
                    const newRecord = prev + 1;
                    teamARecordRef.current = newRecord; // Update ref
                    return newRecord;
                });
                requestRandomNumber(); // Generate new random number
                resetTeamsScore(); // Reset scores
            } else {
                tmpScore.push(point);
                teamAScoreRef.current = tmpScore; // Update ref
                setTeamAScore(tmpScore); // Update state
            }
        } else if (side === "B") {
            console.log(`Received side: B and point: ${point}`);
    
            const tmpScore = [...teamBScoreRef.current]; // Use the ref for team B's current score
            const currentSum = Utils.countSum(tmpScore) + point;
    
            teamBSelectRef.current = point; // Update ref for team B selection
            setTeamBSelect(point); // Update state for UI rendering
    
            if (currentSum > randomNumberRef.current) {
                teamBScoreRef.current = []; // Reset ref value for team B's score
                setTeamBScore([]); // Update state
            } else if (currentSum === randomNumberRef.current) {
                teamBScoreRef.current = []; // Reset ref value for team B's score
                setTeamBRecord((prev) => {
                    const newRecord = prev + 1;
                    teamBRecordRef.current = newRecord; // Update ref
                    return newRecord;
                });
                requestRandomNumber(); // Generate new random number
                resetTeamsScore(); // Reset scores
            } else {
                tmpScore.push(point);
                teamBScoreRef.current = tmpScore; // Update ref
                setTeamBScore(tmpScore); // Update state
            }
        }
    };

    useEffect(() => {
        const reConnect = async () => {
            await BluetoothRemote.startListeningDevice(handleValueOnChange);
        };
        reConnect();
    }, []);

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === "P") {
                resetGame();
            } else if (event.key === "Q") {
                await BluetoothRemote.connectBluetoothDevice();
                await BluetoothRemote.startListeningDevice(handleValueOnChange);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined = undefined;
        if (isStartTimer) {
            requestRandomNumber();
            timer = setInterval(() => {
                setCount((prevCount) => (prevCount < 1 ? 0 : prevCount - 1));
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isStartTimer]);

    const increaseCounter = () => {
        setCount((prev) => prev + 1);
    };

    const decreaseCounter = () => {
        setCount((prev) => prev - 1);
    };

    const onTriggerTimer = () => {
        setIsStartTimer((prev) => !prev);
    };

    const requestRandomNumber = () => {
        setRandomNumber(Math.floor(Math.random() * 10) + 1);
    };

    const resetTeamsScore = () => {
        setTeamAScore([]);
        setTeamBScore([]);
    };

    const resetGame = () => {
        if (window.confirm("Bạn có chắc là muốn reset game không?")) {
            setCount(DEFAULT_COUNTER);
            setIsStartTimer(false);
            setRandomNumber(0);
            setTeamAScore([]);
            setTeamBScore([]);
            setTeamARecord(0);
            setTeamBRecord(0);
        }
    };

    return {
        selectors: {
            count,
            isStartTimer,
            randomNumber,
            teamAScore,
            teamBScore,
            teamARecord,
            teamBRecord,
            teamASelect,
            teamBSelect,
        },
        handlers: {
            increaseCounter,
            decreaseCounter,
            onTriggerTimer,
        },
    };
};