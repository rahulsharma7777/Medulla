import React from "react";
import { Button, Form, Input } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ForgetPasswordRequest } from "../services/Index";
import { hideLoader, showLoader } from "../redux/slice/loaderSlice";
const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
   try {
    dispatch(showLoader())
     const res = await ForgetPasswordRequest(values);
    if (res.status === 200) {
      toast.success("Change password link is sent to email", {
        autoClose: 2000,
      });
      navigate("/login");
    } else {
      toast.error(" invalid email credential", {
        autoClose: 2000,
      });
    }
    
   } catch (error) {
    
   }
   finally{
     dispatch(hideLoader());
   }
  };
  const onFinishFailed = (errorInfo) => {
    toast.error(" there is a error ", {
      autoClose: 2000,
    });
  };

  return (
    <div className="login-sidebar">
      <div className="login-content">
        <h3> Forget Password</h3>
        <Form
          name="basic"
          style={{
            maxWidth: 1500,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input className="login-input" placeholder="Enter Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="submit-btn" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Link to="/login">Login ?</Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
