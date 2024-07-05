import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import ErrorBoundary from "./components/ErrorBoundary";
const root = ReactDOM.createRoot(document.getElementById("root"));
const { REACT_APP_CLIENT_ID } = process.env;

root.render(
  <GoogleOAuthProvider clientId={REACT_APP_CLIENT_ID}>
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

reportWebVitals();
