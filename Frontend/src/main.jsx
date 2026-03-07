import { StrictMode } from "react";
import "leaflet/dist/leaflet.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/utils/AuthContext";

import { store, persistor } from "./redux/store";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <App />
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </PersistGate>
    </Provider>
  </StrictMode>
);