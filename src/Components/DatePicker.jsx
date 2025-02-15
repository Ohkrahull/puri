import { useState } from "react"; 
import Datepicker from "react-tailwindcss-datepicker"; 

const NEXT_MONTH = new Date();
NEXT_MONTH.setMonth(NEXT_MONTH.getMonth() + 1);

const App = () => { 
    const [value, setValue] = useState({ 
        startDate: new Date(), 
        endDate: NEXT_MONTH
    });

    return (
        <Datepicker
            primaryColor={"fuchsia"}
            value={value} 
            onChange={newValue => setValue(newValue)}
            showShortcuts={true}
        /> 
    );
};

export default App;
