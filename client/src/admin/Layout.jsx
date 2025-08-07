import  { useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/global/SideBar";
import TopBar from "./components/global/TopBar";
import ProductList from "./pages/ProductList";
import CategoryList from "./pages/CategoryList";
import DashBoard from "./pages/DashBoard";
import LoginPage from "./pages/LoginPage";
import { AdminContext } from './state/GlobalContext';
import useAdminDetails from './hooks/useAdminDetails';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import { setAxiosDeleteAdmin,setAxiosCreateAdmin } from './utills/axios.delete.admin'


function Layout() {

  const { admin,deleteAdmin,createAdmin } = useContext(AdminContext);
  setAxiosDeleteAdmin(deleteAdmin)
  setAxiosCreateAdmin(createAdmin)
  useAdminDetails()
   if(!admin) return <LoginPage/>

  return (
    <>
      <SideBar />
      <main className="content">
        <TopBar />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/category" element={<CategoryList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-category" element={<AddCategory />} />
        </Routes>
      </main>
    </>
  );
}

export default Layout;
