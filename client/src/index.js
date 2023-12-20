import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Header} from './components/Header/Header';
import {Footer} from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Registration from './pages/Registration/Registration';
import Information from './pages/Information/Information';
import Evolution from './pages/Evolution/Evolution';
import Edit from './pages/Edit/Edit';
import {RecoilRoot} from 'recoil';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:pageNumber" element={<Home />} />
        <Route path="/search/:pageNumber" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/information/:serial" element={<Information />} />
        <Route path="/evolution" element={<Evolution />} />
        <Route path="/edit/:serial" element={<Edit />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </RecoilRoot>
);
