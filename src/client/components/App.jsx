import react, { useState } from "react";
import "./styles.css";
import Select from 'react-select'
import Quest1 from "./puzzles/quest_1";
import Quest2 from "./puzzles/quest_2";
import Quest1Description from "./puzzle_descriptions/quest_1_description";
import Quest2Description from "./puzzle_descriptions/quest_2_description";
const App = () => {
  
  const [selectedOption,setSelectedOption] = useState('quest1');
  const options = [
    { value: 'quest1', label: 'Quest 1' },
    { value: 'quest2', label: 'Quest 2' },
    { value: 'quest3', label: 'Quest 3' }
  ]

  const setOption = (option) => {
    setSelectedOption(option.value);
  }
  
   return (
   <div className="app-wrapper">
    <div className="main-app">
      <Select options={options} onChange={setOption}/>
      <div className="puzzle-wrapper">
        <div className="left">
          <div>
          {selectedOption == 'quest1' && <Quest1Description/>}
          {selectedOption == 'quest2' && <Quest2Description/>}
          </div>
        </div>
        <div className="right">
          {selectedOption == 'quest1' && <Quest1/>}
          {selectedOption == 'quest2' && <Quest2/>}
        </div>
      </div>
    </div>
  </div>
  )
};
export default App;