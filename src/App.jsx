
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import AddSalary from './AddSalary';


export default function App() {
  return (
    <BrowserRouter>

   
     <Routes>

        <Route path="/" element={<AddSalary />} />
        
     </Routes>
     </BrowserRouter>
  )
}
