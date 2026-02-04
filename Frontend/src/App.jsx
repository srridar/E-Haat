import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '../src/index.css'

import Home from "@/components/shared/Home";
import About from "@/components/shared/About"
import Contact from "@/components/shared/Contact"
import RegisterAsk from '@/components/shared/RegisterAsk';
import LoginAsk from '@/components/shared/LoginAsk';
import Notification from '@/components/shared/Notification';


import DashBoard from '@/components/Admin/DashBoard'
import GetAllProducts from "@/components/Admin/GetAllProduct"
import GetAllUsers from "@/components/Admin/GetAllUser"
import GetUser from "@/components/Admin/GetUser"
import AllOrders from '@/components/Admin/AllOrders'
import ReportAdmin from '@/components/Admin/ReportAdmin'
import GetAllContactForm from '@/components/Admin/GetAllContactForm'
import GetSingleContactForm from '@/components/Admin/GetSingleContactForm'
import AdminRegister from "@/components/Admin/AdminRegister";
import AdminLogin from "@/components/Admin/AdminLogin";
import AdminPasswordChange from "@/components/Admin/AdminPasswordChange";
import AdminProfile from "@/components/Admin/AdminProfile";
import ViewContact from '@/components/Admin/ViewContact';



import BuyerRegister from "@/components/Buyer/BuyerRegister";
import BuyerLogin from "@/components/Buyer/BuyerLogin";
import BuyerProfile from "@/components/Buyer/BuyerProfile";
import BuyerProfileUpdate from "@/components/Buyer/BuyerProfileUpdate";
import BuyerPasswordChange from "@/components/Buyer/BuyerPasswordChange";
import GetVerifiedProducts from "@/components/Buyer/GetVerifiedProducts";
import CreateOrderByBuyer from "@/components/Buyer/CreateOrderByBuyer";
import GetAllOrders from "@/components/Buyer/GetAllOrders";


import SellerRegister from "@/components/Seller/SellerRegister";
import SellerLogin from "@/components/Seller/SellerLogin";
import SellerProfile from "@/components/Seller/SellerProfile";
import SellerProfileUpdate from "@/components/Seller/SellerProfileUpdate";
import SellerPasswordChange from '@/components/Seller/SellerPasswordChange';
import AllMyProducts from '@/components/Seller/AllMyProducts'
import GetAllVerifiedSellerProfile from '@/components/Seller/GetAllVerifiedSellerProfile';

import CreateProduct from "@/components/Product/CreateProduct";
import GetAllProductsPage from "@/components/Product/GetAllProducts";
import GetProduct from "@/components/Product/GetProduct";
import UpdateProductDetails from "@/components/Product/UpdateProduct";


import TransporterRegistration from "@/components/Transporter/TransporterRegistration";
import TransporterLogin from "@/components/Transporter/TransporterLogin";
import TransporterProfile from "@/components/Transporter/TransporterProfile";
import TransporterPasswordUpdation from "@/components/Transporter/TransporterPasswordUpdation ";
import TransporterProfileUpdate from "@/components/Transporter/TransporterProfileUpdate";
import TransporterDashboard from "@/components/Transporter/TransporterDashBoard";
import TransporterKycForm from "@/components/Transporter/TransporterKycForm";



const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/register-as',
    element: <RegisterAsk />
  },
  {
    path: '/login-as',
    element: <LoginAsk />
  },

  {
    path: "/admin",
    children: [
      { path: "sadmin-register", element: <AdminRegister /> },
      { path: "login-enter", element: <AdminLogin /> },
      { path: "get-all-users", element: <GetAllUsers /> },
      { path: "get-all-products", element: <GetAllProducts /> },
      { path: "admin-profile", element: <AdminProfile /> },
      { path: "getuser", element: <GetUser /> },
      { path: "dashboard", element: <DashBoard /> },
      { path: "allorders", element: <AllOrders/>},
      { path: "report", element: <ReportAdmin/>},
      { path: "apassword-change", element: <AdminPasswordChange/>},
      { path: "single-contact-data", element: <GetSingleContactForm/>},
      { path: "all-contact-data", element: <GetAllContactForm/>},
      { path: "notifications", element: <Notification /> },
      { path: "get-all-contact", element: <ViewContact/>}


    ],
  },
  {
    path: "/seller",
    children: [
      { path: "sign-in", element: <SellerRegister /> },
      { path: "login", element: <SellerLogin /> },
      { path: "profile", element: <SellerProfile /> },
      { path: "profile/update", element: <SellerProfileUpdate /> },
      { path: "change-password", element: <SellerPasswordChange /> },
      { path: "my-products", element :<AllMyProducts/>},
      { path: "get-all-seller", element: <GetAllVerifiedSellerProfile /> },
      { path: "notifications", element: <Notification/> }
    ],
  },
  {
    path: "/buyer",
    children: [
      { path: "sign-in", element: <BuyerRegister /> },
      { path: "login", element: <BuyerLogin /> },
      { path: "profile", element: <BuyerProfile /> },
      { path: "profile/update", element: <BuyerProfileUpdate /> },
      { path: "change-password", element: <BuyerPasswordChange /> },
      { path: "get-verified-products", element: <GetVerifiedProducts /> },
      { path: "create-order", element: <CreateOrderByBuyer /> },
      { path: "all-orders", element: <GetAllOrders /> },
      { path: "notifications", element: <Notification/> }
    ],
  },
  {
    path: "/product",
    children: [
      { path: "create", element: <CreateProduct /> },
      { path: "allproduct", element: <GetAllProductsPage /> },
      { path: ":id", element: <GetProduct /> },
      { path: "update/:id", element: <UpdateProductDetails /> },
    ],
  },
  {
    path: "/transporter",
    children: [
      { path: "register", element: <TransporterRegistration /> },
      { path: "login", element: <TransporterLogin /> },
      { path: "profile", element: <TransporterProfile /> },
      { path: "profile/update", element: <TransporterProfileUpdate /> },
      { path: "password-change", element: <TransporterPasswordUpdation /> },
      { path: "dashboard", element: <TransporterDashboard /> },
      { path: "kyc-form", element: <TransporterKycForm /> },
      { path: "notifications", element: <Notification /> }
    ],
  },


  {
    path: "/contact",
    children: [
      { path: "create", element: <TransporterRegistration /> },
      { path: "getall", element: <TransporterLogin /> },
      { path: "get-single", element: <TransporterProfile /> },
      { path: "profile/update", element: <TransporterProfileUpdate /> },
     
    ],
  }
]);


function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
