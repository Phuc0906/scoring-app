import { useCallback, useEffect, useState } from "react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let textDecoder = new TextDecoder('utf-8');

    const handleValueOnChange = (event: any) => {
        console.log('value on change: ', event);
        console.log(textDecoder.decode(event));
        const side = textDecoder.decode(event).split(':')[0];
        const selectPoint = textDecoder.decode(event).split(':')[1];
        if (!isStartTimer) {
            return;
        }
        if (side === 'A') {
            console.log(`Received side: A and point: ${parseInt(selectPoint) + 1}`);
            setTeamAScore((prevScore) => {
                let tmpScore = [...prevScore];
                const currentSum = Utils.countSum(tmpScore) + parseInt(selectPoint) + 1;
                console.log('computed score: ', currentSum);
                setTeamASelect(parseInt(selectPoint) + 1);
                if (currentSum > randomNumber) {
                    tmpScore = [];
                } else if (currentSum === randomNumber) {
                    tmpScore = [];
                    setTeamARecord(prevScore => prevScore + 1);
                    requestRandomNumber();
                    resetTeamsScore();
                } else {
                    console.log('append score')
                    tmpScore.push(parseInt(selectPoint) + 1);
                }
                return tmpScore;
            });
        } else {
            console.log(`Received side: B and point: ${parseInt(selectPoint) + 1}`);
            setTeamBScore((prevScore) => {
                let tmpScore = [...prevScore];
                const currentSum = Utils.countSum(tmpScore) + parseInt(selectPoint) + 1;
                setTeamBSelect(parseInt(selectPoint) + 1);
                if (currentSum > randomNumber) {
                    tmpScore = [];
                } else if (currentSum === randomNumber) {
                    tmpScore = [];
                    setTeamBRecord(prevScore => prevScore + 1);
                    requestRandomNumber();
                    resetTeamsScore();
                } else {
                    tmpScore.push(parseInt(selectPoint) + 1);
                }
                return tmpScore;
            });
        }
    }

    useEffect(() => {
        const reConnect = async () => {
            await BluetoothRemote.startListeningDevice(handleValueOnChange);
        };
        reConnect();
    }, [isStartTimer, teamAScore, teamBScore, teamBSelect, teamASelect, teamARecord, teamBRecord]);

    useEffect(() => {

        const handleKeyDown = async (event: KeyboardEvent) => {
            const teamAkeys = ['1', '2', '3', '4'];
            const teamBkeys = ['6', '7', '8', '9'];
            if (event.key === 'P') {
                resetGame();
            }
            if (event.key === 'Q') {
                await BluetoothRemote.connectBluetoothDevice();
                await BluetoothRemote.startListeningDevice(handleValueOnChange);

            }
            if (!isStartTimer) {
                return;
            }
            // Team A checking
            // if (teamAkeys.includes(event.key)) {
            //     setTeamAScore((prevScore) => {
            //         let tmpScore = [...prevScore];
            //         const currentSum = Utils.countSum(tmpScore) + teamAkeys.indexOf(event.key) + 1;
            //         setTeamASelect(teamAkeys.indexOf(event.key) + 1);
            //         if (currentSum > randomNumber) {
            //             tmpScore = [];
            //         } else if (currentSum === randomNumber) {
            //             prevScore = [];
            //             setTeamARecord(prevScore => prevScore + 1);
            //             requestRandomNumber();
            //             resetTeamsScore();
            //         } else {
            //             tmpScore.push(teamAkeys.indexOf(event.key) + 1);
            //         }
            //         return tmpScore;
            //     });
            // }

            // if (teamBkeys.includes(event.key)) {
            //     setTeamBScore((prevScore) => {
            //         let tmpScore = [...prevScore];
            //         const currentSum = Utils.countSum(tmpScore) + teamBkeys.indexOf(event.key) + 1;
            //         setTeamBSelect(teamBkeys.indexOf(event.key) + 1);
            //         if (currentSum > randomNumber) {
            //             console.log('Resetting team B score due to greater');
            //             tmpScore = [];
            //         } else if (currentSum === randomNumber) {
            //             console.log('Resetting team B score due to correct');
            //             tmpScore = [];
            //             setTeamBRecord(prevScore => prevScore + 1);
            //             requestRandomNumber();
            //             resetTeamsScore();
            //         } else {
            //             console.log('increase team B');
            //             tmpScore.push(teamBkeys.indexOf(event.key) + 1);
            //         }
            //         return tmpScore;
            //     });
            // }
            
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isStartTimer, randomNumber, textDecoder]);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined = undefined;
        if (isStartTimer) {
            requestRandomNumber();
            timer = setInterval(() => {
                setCount((prevCount) => {
                  if (prevCount < 1) {
                    setIsStartTimer(false); // Stop counting if target is reached
                    return prevCount;
                  }
                  return prevCount - 1; // Increment count
                });
            }, 1000);
        } else {
            console.log("Timer stopped");
        }
        return () => {
            if (timer) clearInterval(timer); // Cleanup timer on unmount or stop
        };
    }, [isStartTimer]);

    const increaseCounter = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const decreaseCounter = () => {
        setCount((prevCount) => prevCount - 1);
    };

    const onTriggerTimer = () => {
        setIsStartTimer(!isStartTimer);
    }

    const requestRandomNumber = () => {
        setRandomNumber(Math.floor(Math.random() * 10) + 1);
    };

    const resetTeamsScore = () => {
        setTeamAScore([]);
        setTeamBScore([]);
    };

    const resetGame = () => {
        const confirmed = window.confirm("Bạn có chắc là muốn reset game không?");
        if (confirmed) {
            setCount(DEFAULT_COUNTER);
            setIsStartTimer(false);
            setRandomNumber(0);
            setTeamAScore([]);
            setTeamBScore([]);
            setTeamARecord(0);
            setTeamBRecord(0);
        }
    }

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
        }
    }
}