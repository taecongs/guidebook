import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Registration from './pages/Registration/Registration';
import Information from './pages/Information/Information';
import Evolution from './pages/Evolution/Evolution';
import Edit from './pages/Edit/Edit';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/registration" element={<Registration />}></Route>
      <Route path="/information/:serial" element={<Information />} />
      <Route path="/evolution" element={<Evolution />}></Route>
      <Route path="/edit/:serial" element={<Edit />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
