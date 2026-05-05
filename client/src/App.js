import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostItem from './pages/PostItem';
import MyItems from './pages/MyItems';
import ItemDetails from './pages/ItemDetails';
import SearchItems from './pages/SearchItems';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import EditItem from './pages/EditItem';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-item" element={<PostItem />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/edit-item/:id" element={<EditItem />} />
          <Route path="/search" element={<SearchItems />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
