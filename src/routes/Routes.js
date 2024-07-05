import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import Organization from "../pages/Organization";
import SubadminDetail from "../pages/SubAdminDetail.js";
import ManageUsers from "../pages/ManageUsers.js";
import ManageTeams from "../pages/ManageTeams.js";
import ManageAttendence from "../pages/ManageAttendence.js";
import UserAttendenceLogs from "../pages/UserAttendenceLogs.js";
import Leaves from "../pages/Leaves.js";
import Attendence from "../pages/Attendence.js";
import InboxActionLeaves from "../pages/ApproveLeave.js";
import InboxActionPartialDay from "../pages/ApprovePartialDay.js";
import Dashboard from "../pages/Dashboard.js";
import Regularization from "../pages/Regularise.js";
import EmployeesTree from "../pages/EmployeesTree";
import ManageShifts from "../pages/ManageShifts.js";
export const COMMON_ROUTES_BEFORE_LOGIN = {
  LOGIN: {
    path: "/login",
    element: Login,
    key: "login",
  },
  FORGET_PASSWORD: {
    path: "/forget-password",
    element: ForgetPassword,
    key: "forget-password",
  },
  NOT_FOUND: {
    path: "*",
    element: Login,
  },
};
export const ADMIN_ROUTES_BEFORE_LOGIN = {
  ADMIN_LOGIN: {
    path: "/admin-login",
    element: Login,
    key: "admin-login",
  },
  NOT_FOUND: {
    path: "*",
    element: Login,
  },
};

export const ADMIN_ROUTES_AFTER_LOGIN = {
  ADMIN_DASHBOARD: {
    path: "/admin-dashboard",
    element: Organization,
    key: "admin-dashboard",
  },
  SUBADMIN_DETAIL: {
    path: "/organization/:id",
    element: SubadminDetail,
    key: " Subadmin-detail",
  },
};

export const USER_ROUTES_AFTER_LOGIN = {
  DASHBOARD: {
    path: "/subadmin-dashboard",
    element: Dashboard,
    key: "subadmin_dashboard",
  },
  USER_LOGS: {
    path: "/user-attendence/:id",
    element: UserAttendenceLogs,
    key: "user-attendence",
  },

  MANAGE_LEAVES: {
    path: "/user-inbox/Leave-Requests",
    element: InboxActionLeaves,
    key: "user-inbox",
  },
  MANAGE_PARTIAL_DAY: {
    path: "/user-inbox/partial-day",
    element: InboxActionPartialDay,
    key: "user/partial-day",
  },
  MANAGE_REGULARIZE_DAY: {
    path: "/user-inbox/attendence-regularization",
    element: Regularization,
    key: "user/partial-day",
  },
  LEAVES: {
    path: "/me/leaves",
    element: Leaves,
    key: "me/leaves",
  },
  ATTENDENCE: {
    path: "/me/attendence",
    element: Attendence,
    key: "me/leaves",
  },
};

export const SUBADMIN_ROUTES_AFTER_LOGIN = {
  DASHBOARD: {
    path: "/subadmin-dashboard",
    element: Dashboard,
    key: "subadmin_dashboard",
  },
  MANAGE_USERS: {
    path: "/manage-users",
    element: ManageUsers,
    key: "manage-users",
  },
  MANAGE_TEAMS: {
    path: "/manage-teams",
    element: ManageTeams,
    key: "manage-teams",
  },
  MANAGE_ATTENDENCE: {
    path: "/manage-attendence",
    element: ManageAttendence,
    key: "manage-attendence",
  },
  MANAGE_SHIFTS: {
    path: "/manage-shifts",
    element: ManageShifts,
    key: "manage-shifts",
  },
  USER_LOGS: {
    path: "/user-attendence/:id",
    element: UserAttendenceLogs,
    key: "user-attendence",
  },

  MANAGE_LEAVES: {
    path: "/user-inbox/Leave-Requests",
    element: InboxActionLeaves,
    key: "user-inbox",
  },
  MANAGE_PARTIAL_DAY: {
    path: "/user-inbox/partial-day",
    element: InboxActionPartialDay,
    key: "user/partial-day",
  },
  MANAGE_REGULARIZE_DAY: {
    path: "/user-inbox/attendence-regularization",
    element: Regularization,
    key: "user/partial-day",
  },
  LEAVES: {
    path: "/me/leaves",
    element: Leaves,
    key: "me/leaves",
  },
  ATTENDENCE: {
    path: "/me/attendence",
    element: Attendence,
    key: "me/leaves",
  },
  EMPLOYEES_TREE: {
    path: "/org/employees/tree/:id",
    element: EmployeesTree,
    key: "org/employees/tree",
  },
  SHIFT_USERS: {
    path: "/manage-shifts/users/:id",
    element: ManageUsers,
    key: "/manage-shifts/users/:id",
  },
};
