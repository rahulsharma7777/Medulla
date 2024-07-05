import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../redux/slice/loginSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminLogin, userLogin, VerifyGoogleLogin } from "../services/Index";
import { showLoader, hideLoader } from "../redux/slice/loaderSlice";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const fieldName = isLoginPage ? "email" : "username";

  const onFinish = async (values) => {
    if (!isLoginPage) {
      try {
        dispatch(showLoader());
        const res = await AdminLogin(values);
        if (res.status === 200) {
          localStorage.setItem("ADMIN_TOKEN", res?.data?.token);
          dispatch(loginSuccess());

          navigate("/admin-dashboard");
        } else {
          toast.error("Invalid credentials", {
            autoClose: 2000,
          });
        }
      } catch (error) {
        toast.error("Login failed:", error);
        toast.info("Unable to fetch User details", {
          autoClose: 2000,
        });
        dispatch(loginFailure("Login failed. Please check your credentials."));
      } finally {
        dispatch(hideLoader());
      }
    } else {
      try {
        dispatch(showLoader());
        const res = await userLogin(values);
        if (res.status === 200) {
          localStorage.setItem("TOKEN", res?.data.refreshToken);
          dispatch(loginSuccess(res?.data?.role));
          localStorage.setItem("ROLE", res?.data.role);
          localStorage.setItem("USER_ID", res?.data._id);
          localStorage.setItem("PROFILE-IMG", res?.data?.profile_img);
          navigate("/me/leaves");
        } else {
          toast.error("Invalid credentials");
        }
      } catch (error) {
        toast.error("Login failed:", error);
        toast.info("Unable to fetch User details", {
          autoClose: 2000,
        });
        dispatch(loginFailure("Login failed. Please check your credentials."));
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  const responseMessage = async (res) => {
    const userVerified = await VerifyGoogleLogin({
      token: res?.credential,
      client_id: res?.clientId,
    });
    if (userVerified?.data?.accessToken) {
      localStorage.setItem("TOKEN", userVerified?.data?.refreshToken);
      localStorage.setItem("ROLE", userVerified?.data.role);
      localStorage.setItem("PROFILE-IMG", userVerified?.data?.profile_img);
      navigate("/me/leaves");
    } else {
      toast.warning("No user found!", {
        autoClose: 2000,
      });
    }
  };

  const errorMessage = (err) => {
    toast.error("Something went wrong", {
      autoClose: 2000,
    });
  };

  const onFinishFailed = (errorInfo) => {
    const emptyFields = errorInfo.errorFields.map((field) => field.name[0]);
    if (emptyFields.length > 0) {
      toast.warning("Please fill out all fields.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="login-sidebar">
      <div className="login-content">
        {<h3> Login to Medulla</h3>}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <label>{fieldName}</label>

          <Form.Item
            name={fieldName}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="login-input" />
          </Form.Item>
          <label>Password</label>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password className="login-input" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="submit-btn" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {isLoginPage && (
            <Form.Item>
              <Link to="/forget-password">Forgot Password?</Link>
            </Form.Item>
          )}
        </Form>
        {isLoginPage && (
          <>
            <div className="GoogleLogo">
              <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
