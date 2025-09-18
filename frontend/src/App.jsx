import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import Login from './routes/Login';
import PanelAdmin from './routes/PanelAdmin';
import SignUp from './routes/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/panel-admin' element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
