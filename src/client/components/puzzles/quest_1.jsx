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
                score:0,
                statistics: []
            }
        });
    }

    const [tokens, setTokens] = useState([]);
    const [machine, setMachine] = useState([]);
    const [totalScore,setTotalScore] = useState(0);
    const [source, setSource] = useState("");
    const [uniqueSlots, setUniqueSlots] = useState(false);
    const [pathTotals, setPathTotals] = useState([]);
    useEffect(() => {
        setSource("part1Test")
        setUniqueSlots(false);
    },[])

    useEffect(() => {
        if (!source) return
        const dataSet = quest_1_data[source];
        setUniqueSlots(source.includes("part3"))
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

    const initialiseTokens = () => {
        const initialisedTokens = tokens.map(token => {
            return {
                ...token,
                y:0,
                hitCount:0,
                score:0,
                statistics: []
            }
        });
        setTokens(initialisedTokens);
    }

    //Drop specified token into specified slot and see what happens
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
        const score = calculateScore(token, startingSlot);
        token.score = score;
        if (!token.statistics.find(entry => entry.tokenId === token.id && entry.startingSlot === startingSlot)) {
           token.statistics.push({
           tokenId: token.id,
           startingSlot,
           score 
        })
        }
        return token;
    }
    
    const runMachineWithTokensInOrder = () => {
        const unProcessedTokens = tokens;
        const processedTokens = [];
        unProcessedTokens.forEach(token => {
            const startSlot = (token.id + 1);
            token = runMachineWithSingleToken(token, startSlot);     
            processedTokens.push(token);
        })
        sortAndUpdateTokens(processedTokens)
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

    //Lets run each token for each slot and then work out the statistics later
    const runMachineForEachTokenSlotCombination = () => {
        const processedTokens = [];
        tokens.forEach(token => {
          const slotsAvailable = (machine[0].length + 1)/2;
          for (let startingSlot = 1; startingSlot <= slotsAvailable; startingSlot++ ) {
            const unprocessedToken = resetToken(token);
            const processedToken = runMachineWithSingleToken(unprocessedToken, startingSlot);
            //Token is returned with slot and score set
            processedTokens.push(processedToken);
          }
        });
        sortAndUpdateTokens(processedTokens)
    }

    const sortAndUpdateTokens = (tokens) => {
        const sortedAndReducedTokens = tokens.map(token => {
            const sortedStats = token.statistics.sort((a,b) => b.score - a.score);
            return {
                ...token,
                statistics: sortedStats
            }
        }).reduce((acc,item) => {
            if (!acc.find(entry => entry.id === item.id)) {
                acc.push(item);
            }
            return acc;
        },[]).sort((a,b) => {
            return b.score - a.score
        });
        setTokens(sortedAndReducedTokens)
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
        initialiseTokens();
        if (source == "part1Test" || source == "part1") {
            runMachineWithTokensInOrder();
        } else if (source == "part2Test" || source == "part2"){
            runMachineForEachTokenSlotCombination();
        } else {
            runMachineForEachTokenSlotCombination();
            badger();
            //Then work out the highest scoring combination using unique slots
        }

    }

    //For part 3 let's find all combinations
    //Sorted and reduced tokens contains one entry for each token
    //each token object has statistics showing score for each possible slot
    //indexes shows which item we're looking at for each token
    const badger = () => {
        if (!uniqueSlots) {
            console.log(tokens);
            return;
        }
        if (!(tokens.length && machine.length)) {
            return;
        }
       let positions = new Array(tokens.length).fill(0);
       let slotCount = (machine[0].length +1)/2;
       let overflow = false;
       let pathTotals = [];
       let highestTotalOverall = 0;
       let highestTotalWithAllSlots = 0;
       let lowestTotalOverall = 99999;
       let lowestTotalWithAllSlots = 99999;
       while (!overflow) {
         //set the slot numbers
         const statsEntries = positions.map((item,index) => tokens[index].statistics[item]);
         //Combine these to give a score and the number of unique slots used
         const pathTotal = statsEntries.reduce((acc,item)=> {
            if (!acc.slotsUsed.includes(item.startingSlot)){
                acc.slotsUsed.push(item.startingSlot);
            }
            acc.total += item.score;
            return acc;
         },{
            slotsUsed:[],
            total:0
         });
         const totalWithAllSlots = pathTotal.slotsUsed.length === tokens.length ? pathTotal.total : 0;
         const totalOverall = pathTotal.total;
         const lowTotalWithAllSlots = pathTotal.slotsUsed.length === tokens.length ? pathTotal.total : 99999;
         if (totalOverall > highestTotalOverall) {
            pathTotals.push(pathTotal);
            highestTotalOverall = totalOverall;
         }
         if (totalWithAllSlots > highestTotalWithAllSlots) {
            pathTotals.push(pathTotal);
            highestTotalWithAllSlots = totalWithAllSlots;
         }
         if (totalOverall < lowestTotalOverall) {
            pathTotals.push(pathTotal);
            lowestTotalOverall = totalOverall;
         }
         if (lowTotalWithAllSlots < lowestTotalWithAllSlots) {
            pathTotals.push(pathTotal);
            lowestTotalWithAllSlots = lowTotalWithAllSlots;
         }
         //now increment the last position and overflow as required
         let ripple = true;
         for (let tokenIndex = tokens.length - 1; tokenIndex > -1; tokenIndex --) {
            if (ripple) {
                positions[tokenIndex] += 1;
                if (positions[tokenIndex] >= slotCount) {
                  positions[tokenIndex] = 0;
                  if (tokenIndex > 0) {
                    ripple = true;
                  } else overflow = true;
                } else ripple = false;
            };
         }
       }
       setPathTotals(pathTotals);
    }

    const getHighestScore = () => {
        const allSlots = tokens.length;
        const sortedPathTotals = pathTotals.sort((a,b) => b.total - a.total);
        //If uniqueSlots return highest with allSlots
        const highScore = uniqueSlots 
            ? (sortedPathTotals.filter(item => item.slotsUsed.length === allSlots)[0] || {}).total
            : (sortedPathTotals[0] || {}).total;
        return highScore || 0;
    }

    const getLowestScore = () => {
        const allSlots = tokens.length;
        const sortedPathTotals = pathTotals.sort((a,b) => a.total - b.total);
        //If uniqueSlots return lowest with allSlots
        const lowScore = uniqueSlots 
            ? (sortedPathTotals.filter(item => item.slotsUsed.length === allSlots)[0] || {}).total
            : (sortedPathTotals[0] || {}).total;
        return lowScore || 0;
    }

    const drawSlotStatistics = () => {
        let allScores = [];
        tokens.forEach(token => {
            allScores = allScores.concat(token.statistics.map(item => item.score));
        });
        const availableScores = allScores.reduce((acc,item) => {
            if (!acc.includes(item)){
                acc.push(item);
            }
            return acc;
        },[]).sort((a,b) => b-a);

        const availableSlots = tokens.length ? tokens[0].statistics.map(item => item.startingSlot).sort((a,b)=>b-a): [];
        console.log(`Available scores at start ${availableScores.join(',')}`);
        console.log(`Available slots at start ${availableSlots.join(',')}`)
        const highest = getHighestScore(availableSlots,availableScores);
        const lowest = getLowestScore(availableSlots, availableScores);
        return(
            <div>
              <p>Highest score{uniqueSlots ? ` with unique slots`:''}: {highest}</p>
              <p>Lowest score{uniqueSlots ? ` with unique slots`:''}: {lowest}</p>
            </div>
        )
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
             <label htmlFor="part2">Part 2 Test</label> 
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
             <input 
                key="ri5"
                type="radio"
                id="Part_3_Test1"
                name="source"
                value="part3Test1"
                checked={source == "part3Test1"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part3Test1')}}
                />
             <label htmlFor="part3Test1">Part 3 Test 1</label> 
             <input 
                key="ri6"
                type="radio"
                id="Part_3_Test2"
                name="source"
                value="part3Test2"
                checked={source == "part3Test2"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part3Test2')}}
                />
             <label htmlFor="part3test1">Part 3 Test 2</label> <input 
                key="ri7"
                type="radio"
                id="Part_3_Test3"
                name="source"
                value="part3Test3"
                checked={source == "part3Test3"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part3Test3')}}
                />
             <label htmlFor="part3test1">Part 3 Test 3</label> <input 
                key="ri8"
                type="radio"
                id="Part_3"
                name="source"
                value="part3"
                checked={source == "part3"}
                onClick={handleClick}
                onChange={()=> {console.log('onChange part3')}}
                />
             <label htmlFor="part3test1">Part 3</label> 
             </div>
            <button onClick={runPuzzle}>Run machine</button>
            <hr/>
            <div key="dm1">{drawMachine(machine)}</div>
            <hr/>
            <div key="stats2">{drawSlotStatistics()}</div>
            
            <div key="ts1">Total Score {totalScore}</div>
        </div>
        
    )
}

export default Quest1;