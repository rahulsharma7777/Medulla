import axios from "axios";
const makeApiCall = async (method, url, data = {}, headers = {}) => {
  const headersWithContentType = {
    ...headers,
    "Content-Type": "application/json",
  };
  const config = {
    method,
    url,
    headers: headersWithContentType,
    data,
  };
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (err) {
      const status = err.response?.status || 500;
      const error_message = err.response?.data?.message || 500;

      return { status, error_message };
    }
  );
  return await axios.request(config);
};

export default makeApiCall;
