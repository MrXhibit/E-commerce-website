import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/global/SideBar";
import TopBar from "./components/global/TopBar";
import ProductList from "./pages/ProductList";
import CategoryList from "./pages/CategoryList";
import DashBoard from "./pages/DashBoard";


function Layout() {
  return (
    <>
      <SideBar />
      <main className="content">
        <TopBar />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/categorys" element={<CategoryList />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </main>
    </>
  );
}

export default Layout;
