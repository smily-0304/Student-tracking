import logo from './logo.svg';
import './App.css';
import Homepage from './pages/homepage';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

import AddStudent from './pages/addstudent';
import ViewStudent from './pages/viewstudent';
import Status from './pages/status';
import Percentage from './pages/percentage';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='add' element={<AddStudent/>}/>
      <Route path='view' element={<ViewStudent/>}/>
      <Route path='status' element={<Status/>}/>
      <Route path='percentage' element={<Percentage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
