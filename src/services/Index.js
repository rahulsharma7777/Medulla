import makeApiCall from "./BaseApi";

// Base url
// const url = "https://medulla-be-h2oa.onrender.com";
// const url = "http://192.168.1.143:3000";
const url = "https://medulla-be-1-pkp0.onrender.com";
// const url = "http://192.168.1.84:3002";
// const url = "http://192.168.1.102:3000";
// const url = "http://192.168.1.19:3001";
// const url = "http://192.168.1.139:3002";
// const url = "http://192.168.1.107:3000";
let headers = {};
const getToken = () => {
  const token = localStorage.getItem("TOKEN");

  return token;
};
const getAdminToken = () => {
  const token = localStorage.getItem("ADMIN_TOKEN");

  return token;
};

export const AdminLogin = async (data) => {
  const apiUrl = `${url}/admin/login`;
  return await makeApiCall("post", apiUrl, data);
};
export const ForgetPasswordRequest = async (data) => {
  const apiUrl = `${url}/forgot-password`;
  return await makeApiCall("post", apiUrl, data);
};

export const getOrgList = async () => {
  const apiUrl = `${url}/admin/org/getByName`;
  const token = getAdminToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, {}, headers);
};

export const addNewOrg = async (data) => {
  const apiUrl = `${url}/admin/org/add`;
  const token = getAdminToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};

export const editNewOrg = async (data, id) => {
  const apiUrl = `${url}/admin/org/update/${id}`;
  const token = getAdminToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("put", apiUrl, data, headers);
};

export const deleteNewOrg = async (id) => {
  const apiUrl = `${url}/admin/org/delete/${id}`;
  const token = getAdminToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("delete", apiUrl, {}, headers);
};

export const getOrgById = async (id) => {
  const apiUrl = `${url}/admin/org/getById/${id}`;
  const token = getAdminToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getConsumedLeavesData = async () => {
  const apiUrl = `${url}/user/leave-consumed`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const getWeeklyAttendance = async () => {
  const apiUrl = `${url}/user/arrival-time/0`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const addSubadmin = async (data) => {
  const apiUrl = `${url}/admin/subAdmin/add`;
  const token = getAdminToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};

export const userLogin = async (data) => {
  const apiUrl = `${url}/user/login`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const getNotifications = async () => {
  const apiUrl = `${url}/user/get-user-notifications`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getUsers = async () => {
  const apiUrl = `${url}/subAdmin/users-getByName`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getRegularisationHistory = async () => {
  const apiUrl = `${url}/user/get-regularizations`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getSudadminPartialHistory = async (id) => {
  const apiUrl = `${url}/subAdmin/partial-leave/${id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const getSubadminRegularisationHistory = async (id) => {
  const apiUrl = `${url}/subAdmin/get-regularizations/${id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const addTeam = async (data) => {
  const apiUrl = `${url}/subAdmin/team/add`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};

export const getTeams = async () => {
  const apiUrl = `${url}/subAdmin/team/getByName`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, {}, headers);
};
export const VerifyGoogleLogin = async (data) => {
  const apiUrl = `${url}/login-google`;
  return await makeApiCall("post", apiUrl, data);
};

export const deleteTeam = async (name) => {
  const apiUrl = `${url}/subAdmin/team/delete`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("delete", apiUrl, name, headers);
};
export const getShift = async () => {
  const apiUrl = `${url}/user/user-shift`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const editTeam = async (data, id) => {
  const apiUrl = `${url}/subAdmin/team/update/${id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("put", apiUrl, data, headers);
};

export const addUser = async (data) => {
  const apiUrl = `${url}/subAdmin/user-add`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const getShiftUsers = async (id) => {
  const apiUrl = `${url}/subadmin/shift/get-users?shiftId=${id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const peersOnLeave = async () => {
  const apiUrl = `${url}/user/peers-on-leave'`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const cancleLeave = async (data) => {
  const apiUrl = `${url}/user/cancle-leave`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const reapplyLeave = async (id) => {
  const apiUrl = `${url}/user/reapply-leave/${id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, {}, headers);
};

export const getLogs = async (from, to, id) => {
  const apiUrl = `${url}/subAdmin/log/${from}/${to}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  const userId = { user_id: id };
  return await makeApiCall("post", apiUrl, userId, headers);
};
export const getUserLogs = async (from, to, id) => {
  const apiUrl = `${url}/user/log/${from}/${to}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  const userId = { user_id: id };
  return await makeApiCall("get", apiUrl, userId, headers);
};
export const getSubadminUserShift = async (id) => {
  const apiUrl = `${url}/subAdmin/get-user-shift/${id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getGeneralLeaves = async () => {
  const apiUrl = `${url}/user/inbox/${1}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const updateUser = async (data, userId) => {
  const apiUrl = `${url}/subAdmin/update-user/${userId}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("patch", apiUrl, data, headers);
};
export const updateInbox = async (data) => {
  const apiUrl = `${url}/user/update-user-notification`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("put", apiUrl, data, headers);
};

export const getShifts = async () => {
  const apiUrl = `${url}/subAdmin/shift/get`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const getPartialLeaves = async () => {
  const apiUrl = `${url}/user/inbox/${2}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const acceptleaves = async (data) => {
  const apiUrl = `${url}/user/leave-approved`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const acceptPartialDay = async (data) => {
  const apiUrl = `${url}/user/inbox-action/2`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const acceptRegularisation = async (data) => {
  const apiUrl = `${url}/user/inbox-action/3`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};

export const deleteUser = async (user_id) => {
  const apiUrl = `${url}/subAdmin/user-delete/${user_id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("delete", apiUrl, {}, headers);
};
export const addShift = async (value) => {
  const apiUrl = `${url}/subAdmin/shift/add`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, value, headers);
};
export const getAvailableLeaves = async () => {
  const apiUrl = `${url}/user/available-leaves`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getOrgUsers = async (data) => {
  const value = { user_name: data };

  const apiUrl = `${url}/user/get-org-users`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, value, headers);
};
export const getManager = async () => {
  const apiUrl = `${url}/user/manager`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const applyLeaves = async (data) => {
  const apiUrl = `${url}/user/leave-request`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const leavesHistory = async () => {
  const apiUrl = `${url}/user/user-leaves`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const getRegularization = async () => {
  const apiUrl = `${url}/user/inbox/${3}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const clockIn = async (payload) => {
  const additionalHeaders = {
    "X-Forwarded-For": "182.77.63.188",
  };
  const apiUrl = `${url}/user/clockIn`;
  const token = getToken();
  const headers = { ...additionalHeaders, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, payload, headers);
};

export const clockOut = async (payload) => {
  const additionalHeaders = {
    "X-Forwarded-For": "182.77.63.188",
  };
  const apiUrl = `${url}/user/clockOut`;
  const token = getToken();
  const headers = { ...additionalHeaders, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, payload, headers);
};

export const teamHierarchy = async (team_id) => {
  const apiUrl = `${url}/subAdmin/team/team-hierarchy/${team_id}`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};

export const getUserPartialLeaves = async () => {
  const apiUrl = `${url}/user/partial-leave`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("get", apiUrl, {}, headers);
};
export const applyPartialDay = async (data) => {
  const apiUrl = `${url}/user/partial-day`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
export const ApplyforRegularise = async (data) => {
  const apiUrl = `${url}/user/regularise`;
  const token = getToken();
  headers = { ...headers, Authorization: `Bearer ${token}` };
  return await makeApiCall("post", apiUrl, data, headers);
};
