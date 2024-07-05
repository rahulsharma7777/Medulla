import React from "react";
import { Navigate } from "react-router-dom";

export const isAuthenticated = () => {
  return localStorage.getItem("TOKEN") !== null;
};
export const isAdminAuthenticated = () => {
  return localStorage.getItem("ADMIN_TOKEN") !== null;
};
export const isSubadmin = () => {
  return localStorage.getItem("ROLE") === "1";
};

export const RouteForAfterLogin = ({ element: Component, ...rest }) => {
  return isAuthenticated() && isSubadmin() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};
export const RouteForUserAfterLogin = ({ element: Component, ...rest }) => {
  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};
export const RouteForBeforeLogin = ({ element: Component, ...rest }) => {
  return !isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/me/leaves" replace />
  );
};
export const RouteForAdminBeforeLogin = ({ element: Component, ...rest }) => {
  console.log("control reached here before")
  return !isAdminAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/admin-dashboard" replace />
  );
};
export const RouteForAdminAfterLogin = ({ element: Component, ...rest }) => {
    console.log("control reached here after")
  return isAdminAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/admin-login" replace />
  );
};
