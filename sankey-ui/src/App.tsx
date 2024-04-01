import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TxView from "./TxView";
import BlockView from "./BlockView";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BlockView />} />
                <Route path="/view/:id" element={<TxView/>} />
            </Routes>
        </Router>
    );
}

export default App;


