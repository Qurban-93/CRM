import { Formik, Field, Form, ErrorMessage } from 'formik';
import { LoadingOutlined, EyeOutlined } from '@ant-design/icons';
import { useLoginMutation } from "@/redux/api/authApi";
import { useNotification } from '../notification';
import * as Yup from 'yup';
import "./index.scss";
import { Link } from 'react-router-dom';
import { Spin } from 'antd';




export const LoginForm = () => {

  const [login, { isLoading }] = useLoginMutation();
  const { contextHolder, openNotificationWithIcon } = useNotification();

  const showPassword = () => {
    if (document.querySelector(".password").type === "password") {
      document.querySelector(".password").type = "text"
    } else {
      document.querySelector(".password").type = "password";
    }

  }

  const validation = Yup.object({
    email: Yup.string()
      .required('Required field!').email('Not valid Email pattern'),
    password: Yup.string()
      .min(8, 'Password length minimum 8')
      .required('Required field!')
  });


  const onSubmitLogin = async (values) => {
    const resp = await login(values);

    if (resp.error) {
      openNotificationWithIcon('error', "Invalid password or email!");
      return;
    }
  }

  return (
    <>
      {contextHolder}
      <Formik initialValues={
        {
          email: "",
          password: "",
        }
      }
        validationSchema={validation}
        onSubmit={values => onSubmitLogin(values)}>
        <div className='login-section'>
          <div className="login-form">
            <h1>Login Form</h1>
            <Form action="">
              <label htmlFor="">User Email</label>

              <Field className="userName" name="email" type="text" placeholder="Enter email" />
              <ErrorMessage component="div" className="error" name="email" />
              <label htmlFor="">Password</label>
              <div className="password-input">
                <Field className="password" name="password" type="password" placeholder="Enter password" />
                <i className='show-icon' onClick={showPassword}><EyeOutlined /></i>
              </div>
              <ErrorMessage component="div" className="error" name="password" />
              <div className="rememmber-me-forgot-password">
                <div className="remember-me">
                  <input name="rememmberMe" type="checkbox" />
                  <span>Rememmber Me</span>
                </div>
                <Link to={'/forgot-password'}>Forgot Password</Link>
              </div>
              <div className="button">
                {isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />} style={{ margin: 'auto', padding: '20px' }} /> : <button type="submit">Log In</button>}
              </div>
            </Form>
          </div>
        </div>
      </Formik>
    </>
  )
}
