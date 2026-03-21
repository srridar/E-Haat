import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '../src/index.css'

import Home from "@/components/shared/Home";
import About from "@/components/shared/About"
import Contact from "@/components/shared/Contact"
import RegisterAsk from '@/components/shared/RegisterAsk';
import LoginAsk from '@/components/shared/LoginAsk';
import Notification from '@/components/shared/Notification';
import Farmers from '@/components/shared/Farmers';


import DashBoard from '@/components/Admin/DashBoard'
import GetAllProducts from "@/components/Admin/GetAllProduct"
import GetAllUsers from "@/components/Admin/GetAllUser"
import GetUser from "@/components/Admin/GetUser"
import AllOrders from '@/components/Admin/AllOrders'
import Order from '@/components/Admin/Order';
import ReportAdmin from '@/components/Admin/ReportAdmin'
import GetAllContactForm from '@/components/Admin/GetAllContactForm'
import ViewSingleContact from '@/components/Admin/ViewSingleContact'
import AdminRegister from "@/components/Admin/AdminRegister";
import AdminLogin from "@/components/Admin/AdminLogin";
import AdminPasswordChange from "@/components/Admin/AdminPasswordChange";
import AdminProfile from "@/components/Admin/AdminProfile";
import ProductApprovalRequest from '@/components/Admin/ApprovalProductRequest';
import SellerApprovalRequest from '@/components/Admin/ApprovalSellerRequest';
import TransporterApprovalRequest from '@/components/Admin/ApprovalTransporterRequest';
import ViewProductCompletly from '@/components/Admin/ViewProductCompletly';
import ViewSellerCompletly from '@/components/Admin/ViewSellerCompletly';
import ViewTransporterCompletly from '@/components/Admin/ViewTransporterCompletly';
import AdminProfileUpdate from '@/components/Admin/AdminProfileUpdate.jsx'
import Messaging from '@/components/Admin/Messageing';




import BuyerRegister from "@/components/Buyer/BuyerRegister";
import BuyerLogin from "@/components/Buyer/BuyerLogin";
import BuyerProfile from "@/components/Buyer/BuyerProfile";
import BuyerProfileUpdate from "@/components/Buyer/BuyerProfileUpdate";
import BuyerPasswordChange from "@/components/Buyer/BuyerPasswordChange";
import BuyerLocationUpdation from '@/components/Buyer/BuyerLocationUpdation';
import CreateOrderByBuyer from "@/components/Buyer/CreateOrderByBuyer";
import GetAllOrders from "@/components/Buyer/GetAllOrders";
import MyRequests from '@/components/Buyer/MyRequests';
import OrderSuccessTracking from '@/components/Buyer/GetOrder';


import SellerRegister from "@/components/Seller/SellerRegister";
import SellerLogin from "@/components/Seller/SellerLogin";
import SellerProfile from "@/components/Seller/SellerProfile";
import SellerProfileUpdate from "@/components/Seller/SellerProfileUpdate";
import SellerPasswordChange from '@/components/Seller/SellerPasswordChange';
import AllMyProducts from '@/components/Seller/AllMyProducts'
import GetAllVerifiedSellerProfile from '@/components/Seller/GetAllVerifiedSellerProfile';
import SellerLocationUpdation from '@/components/Seller/SellerLocationUpdation';

import CreateProduct from "@/components/Product/CreateProduct";
import GetAllProductsPage from "@/components/Product/GetAllProducts";
import GetProduct from "@/components/Product/GetProduct";
import UpdateProductDetails from "@/components/Product/UpdateProduct";
import Cart from "@/components/Product/Cart";
import CheckOut from "@/components/Product/CheckOut";
import TransporterDiscoveryMap from "@/components/Product/TransporterDiscoveryMap";
import HireTransporter from '@/components/Product/HireTransporter';
import ViewRequestCompletly from '@/components/Transporter/ViewRequestCompletly';


import TransporterRegistration from "@/components/Transporter/TransporterRegistration";
import TransporterLogin from "@/components/Transporter/TransporterLogin";
import TransporterProfile from "@/components/Transporter/TransporterProfile";
import TransporterPasswordUpdation from "@/components/Transporter/TransporterPasswordUpdation ";
import TransporterProfileUpdate from "@/components/Transporter/TransporterProfileUpdate";
import TransporterDashboard from "@/components/Transporter/TransporterDashBoard";
import TransporterKycForm from "@/components/Transporter/TransporterKycForm";
import TransporterLocationSelection from "@/components/Transporter/TransporterLocationSelection";
import GetParticularTransporter from '@/components/Transporter/GetParticularTransporter';
import ViewAllRequest from '@/components/Transporter/ViewAllRequest';
import MessageToOther from '@/components/Transporter/MessageToOther';



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
     path  : '/farmers',
     element : <Farmers />
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
      { path: "user/:role/:id", element: <GetUser /> },
      { path: "dashboard", element: <DashBoard /> },
      { path: "allorders", element: <AllOrders/>},
      { path: "order/:id", element: <Order/>},
      { path: "report", element: <ReportAdmin/>},
      { path: "apassword-change", element: <AdminPasswordChange/>},
      { path: "single-contact/:id", element: <ViewSingleContact/>},
      { path: "all-contact-data", element: <GetAllContactForm/>},
      { path: "notifications", element: <Notification /> },
      { path: "product-approval-request", element: <ProductApprovalRequest/>},
      { path: "seller-approval-request", element: <SellerApprovalRequest/>},
      { path: "transporter-approval-request", element: <TransporterApprovalRequest/> },
      { path: "view-seller-details/:id", element: <ViewSellerCompletly/>},
      { path: "view-transporter-details/:id", element: <ViewTransporterCompletly/>},
      { path: "view-product-details/:id", element: <ViewProductCompletly/>},
      { path: "admin-profile-update", element: <AdminProfileUpdate/>},
      { path: "password-change", element: <AdminPasswordChange/>},
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
      { path: "notifications", element: <Notification/> },
      { path: "location-selection", element: <SellerLocationUpdation /> },
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
      { path: "create-order", element: <CreateOrderByBuyer /> },
      { path: "all-orders", element: <GetAllOrders /> },
      { path: "notifications", element: <Notification/> },
      { path: "transporter-details/:id", element: <GetParticularTransporter/>},
      { path: "all-request", element: <MyRequests/>},
      { path: "order-tracking/:id", element: <OrderSuccessTracking/>},
      { path: "location-selection", element: <BuyerLocationUpdation /> },
    ],
  },
  {
    path: "/product",
    children: [
      { path: "create", element: <CreateProduct /> },
      { path: "all", element: <GetAllProductsPage /> },
      { path: ":id", element: <GetProduct /> },
      { path: "update/:id", element: <UpdateProductDetails /> },
      { path: "cart", element: <Cart/>},
      { path: "checkout", element: <CheckOut/>},
      { path: "get-transporter", element: <TransporterDiscoveryMap /> },
      { path: "hire-transporter/:id", element: <HireTransporter/>},
      { path: "create-order/:id", element: <CreateOrderByBuyer/>}
    ],
  },
  {
    path: "/transporter",
    children: [
      { path: "sign-in", element: <TransporterRegistration /> },
      { path: "login", element: <TransporterLogin /> },
      { path: "profile", element: <TransporterProfile /> },
      { path: "profile/update", element: <TransporterProfileUpdate /> },
      { path: "password-change", element: <TransporterPasswordUpdation /> },
      { path: "dashboard", element: <TransporterDashboard /> },
      { path: "kyc-form", element: <TransporterKycForm /> },
      { path: "notifications", element: <Notification /> },
      { path: "location-selection", element: <TransporterLocationSelection /> },
      { path: "view-request/:id", element: <ViewRequestCompletly/>},
      {
        path: "all-requests",element: <ViewAllRequest/>
      }
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
  },
  {
     path:"/message",
     children :[
      { path: "send/:role/:id" , element: <Messaging/>},
      { path: "chat/:role/:id", element: <MessageToOther />} ,
      { path:"chat", element: <MessageToOther/> }
      
     ]
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
