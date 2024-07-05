import React from "react";
import { Routes, Route ,Navigate } from "react-router-dom";
import LayoutBeforeLogin from "../layout/LayoutBeforeLogin";
import LayoutAfterLogin from "../layout/LayoutAfterLogin";
import { LayoutForAdmin } from "../layout/LayoutForAdmin";
import {
  ADMIN_ROUTES_AFTER_LOGIN,
  COMMON_ROUTES_BEFORE_LOGIN,
  SUBADMIN_ROUTES_AFTER_LOGIN,
  ADMIN_ROUTES_BEFORE_LOGIN,
  USER_ROUTES_AFTER_LOGIN,
} from "./Routes";
import {
  RouteForAfterLogin,
  RouteForBeforeLogin,
  RouteForAdminBeforeLogin,
  RouteForAdminAfterLogin,
  RouteForUserAfterLogin,
} from "../routes/RouteFunctions";

const RoutesComponent = () => {
  return (
    <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
      <Route element={<LayoutBeforeLogin />}>
        {Object.values(COMMON_ROUTES_BEFORE_LOGIN).map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<RouteForBeforeLogin element={route.element} />}
          />
        ))}
      </Route>
      <Route element={<LayoutBeforeLogin />}>
        {Object.values(ADMIN_ROUTES_BEFORE_LOGIN).map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<RouteForAdminBeforeLogin element={route.element} />}
          />
        ))}
      </Route>
      <Route element={<LayoutAfterLogin />}>
        {Object.values(USER_ROUTES_AFTER_LOGIN).map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<RouteForUserAfterLogin element={route.element} />}
          />
        ))}
      </Route>
      <Route element={<LayoutAfterLogin />}>
        {Object.values(SUBADMIN_ROUTES_AFTER_LOGIN).map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<RouteForAfterLogin element={route.element} />}
          />
        ))}
      </Route>

      <Route element={<LayoutForAdmin />}>
        {Object.values(ADMIN_ROUTES_AFTER_LOGIN).map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<RouteForAdminAfterLogin element={route.element} />}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default RoutesComponent;
