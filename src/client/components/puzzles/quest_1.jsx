import react, { useEffect, useState } from "react";
import "../styles.css";
import { quest_1_data } from "../puzzle_data/quest_1_data";

const Quest1 = () => {

    const generateTokens = (tokenData) => {
        return tokenData.map((data,index)=> {
            const startingPosition = index * 2;
            return {
                id: index,
                directions: data,
                x: startingPosition,
                y:0,
                hitCount:0,
                score:0
            }
        });
    }

    const [tokens, setTokens] = useState([]);
    const [machine, setMachine] = useState([]);
    const [totalScore,setTotalScore] = useState(0);
    const [source, setSource] = useState("");
    useEffect(() => {
        setSource("part1Test")
    },[])

    useEffect(() => {
        if (!source) return
        const dataSet = quest_1_data[source];
        setMachine(generateMachine(dataSet.machine));
        setTokens(generateTokens(dataSet.input));
    },[source])

    useEffect(() => {
        const total = tokens.reduce((acc,curr) => {
            return acc + curr.score;
        },0);
        setTotalScore(total);
    },[tokens]);

    const generateMachine = (machineData) => {
        let machineRows = [];
        machineData.forEach((row,rowIndex) => {
            let elements = row.split('');
            let machineParts = elements.map((el,index)=> {
                let leftWall = index == 0;
                let rightWall = (index == elements.length - 1);
                let isPin = el == "*";
                return {
                    x: index,
                    y: rowIndex,
                    leftWall,
                    rightWall,
                    isPin
                }
            });
            machineRows.push(machineParts);
        });
        return machineRows;
    }

    const runMachineWithSingleToken = (token, startingSlot) => {
        token.x = (startingSlot - 1)*2;
        while(token.y < machine.length) {
            const instruction = token.directions[token.hitCount];
            const element = machine[token.y][token.x]
            if(element.isPin){
                token.hitCount ++;
                if (instruction == 'L'){
                    if (element.leftWall) {
                        token.x ++;
                    } else {
                        token.x --;
                    }
                } else {
                    if (element.rightWall) {
                        token.x --;
                    } else {
                        token.x ++;
                    }
                }
            }
            token.y ++;
        }
        return token;
    }
    
    const runMachineWithTokensInOrder = () => {
        const unProcessedTokens = tokens;
        const processedTokens = [];
        unProcessedTokens.forEach(token => {
            const startSlot = (token.id + 1);
            token = runMachineWithSingleToken(token, startSlot)      
            // const endSlot = ((token.x/2) + 1);
            // const actualScore = (endSlot * 2) - startSlot;
            // token.score = actualScore > 0 ? actualScore : 0;
            token.score = calculateScore(token, startSlot);
            processedTokens.push(token);
        })
        setTokens(processedTokens)
    };

    const resetToken = (token) => {
        const xPos = token.id * 2;
        return {
            ...token,
            score:0,
            y:0,
            x: xPos,
            hitCount:0,
        }
    }

    const calculateScore = (token, startSlot) => {
        const endSlot = ((token.x/2) + 1);
        const actualScore = (endSlot * 2) - startSlot;
        return actualScore > 0 ? actualScore : 0;
    }

    const runMachineForMaxScore = () => {
        const processedTokens = [];
        tokens.forEach(token => {
          console.log(`Token ${token.id}`);
          const slotsAvailable = (machine[0].length + 1)/2;
          let highScore = 0;
          let slotWithHighestScore = 0;
          for (let startingSlot = 1; startingSlot <= slotsAvailable; startingSlot++ ) {
            const unprocessedToken = resetToken(token);
            const processedToken = runMachineWithSingleToken(unprocessedToken, startingSlot);
            const scoreFromThisSlot = calculateScore(processedToken, startingSlot);
            console.log(`Score at slot ${startingSlot}, ${scoreFromThisSlot}`);
            if (scoreFromThisSlot > highScore) {
                highScore = scoreFromThisSlot;
                slotWithHighestScore = startingSlot;
            }
          }
          console.log(`Highest score was ${highScore} at slot ${slotWithHighestScore}`);
          const highestScoringToken = {
            ...token,
            score: highScore
          }
          processedTokens.push(highestScoringToken);
        })
        setTokens(processedTokens)
    }

    const drawMachine = (machine) => {
        const rows =  machine.map(row => {
            return row.map(el => el.isPin ? '*' : '.').join(' ');
        });
        return rows.map((row,index) => {
            return(
                <div key={index}>
                    <div>{row}</div>
                </div>  
            )
        })
    }
    const handleClick = (e) => {
        setSource(e.target.value);
    }

    const runPuzzle = () => {
        if (source == "part1Test" || source == "part1") {
            runMachineWithTokensInOrder();
        } else {
            runMachineForMaxScore();
        }
    }

   return (
        <div>
            <div key="rg1">
             <input 
                key="ri1"
                type="radio"
                id="Part_1_Test" 
                name="source" 
                value="part1Test" 
                checked={source == "part1Test"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange test')}}
                />
             <label htmlFor="test">Part 1 Test</label>
             <input 
                key="ri2"
                type="radio"
                id="Part_1"
                name="source"
                value="part1"
                checked={source == "part1"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part1')}}
                />
             <label htmlFor="part1">Part 1</label>
             <input 
                key="ri3"
                type="radio"
                id="Part_2_Test"
                name="source"
                value="part2Test"
                checked={source == "part2Test"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part2Test')}}
                />
             <label htmlFor="part2">Part 2</label> 
             <input 
                key="ri4"
                type="radio"
                id="Part_2"
                name="source"
                value="part2"
                checked={source == "part2"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part2')}}
                />
             <label htmlFor="part2">Part 2</label> 
             </div>
            <button onClick={runPuzzle}>Run machine</button>
            <hr/>
            <div key="dm1">{drawMachine(machine)}</div>
            <div key="ts1">Total Score {totalScore}</div>
        </div>
        
    )
}

export default Quest1;