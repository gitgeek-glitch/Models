import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Alex from './components/Alex';
import Incept from './components/Incept';
import Ensemble from './components/Ensemble';

function Def() {
  return (<h1>Hi</h1>);
}

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Def />} />
          <Route path="/alex" element={<Alex />} />
          <Route path="/incept" element={<Incept />} />
          <Route path="/ensemble" element={<Ensemble />} />
        </Routes>
    </Router>
  );
}

export default App;
