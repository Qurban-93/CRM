import Otp from './otp';
import { NewPasswordForm } from './newPasswordForm';
import { LoadingOutlined } from '@ant-design/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useSendEmailMutation } from "@/redux/api/authApi";
import { useNotification } from '../notification';
import { Link } from 'react-router-dom';
import { useState } from "react";
import * as Yup from 'yup';
import "./index.scss";
import { Spin } from 'antd';






export const ForgotPasswordForm = () => {


  const [email, setEmail] = useState('');
  const [sendEmail, { isLoading }] = useSendEmailMutation();
  const { contextHolder, openNotificationWithIcon } = useNotification();
  const [step, setStep] = useState(1);

  const validation = Yup.object({
    email: Yup.string().email().required('Обязательное поле!')
  });



  const onEmailSubmit = async (values) => {
    const resp = await sendEmail(values);
    if (resp.error) {
      openNotificationWithIcon('error', `${resp.error.data.message}`);
      return;
    }
    setStep(2);
    setEmail(values.email)
  }


  const firstContent = step === 1 ? <Formik initialValues={
    {
      email: "",
    }
  }
    validationSchema={validation}
    onSubmit={values => onEmailSubmit(values)}>
    <div className='login-section'>
      <div className="login-form">
        <h1>Forgot password form</h1>
        <Form action="">
          <label htmlFor="">Email for send </label>
          <Field className="userName" name="email" type="text" placeholder="Enter email" />
          <ErrorMessage component="div" className="error" name="email" />
          <div className="button-forgot">
            {isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />} style={{ margin: 'auto', padding: '20px' }} /> : <><button type="submit">Send email</button>
              <Link className='back-btn' to={'/'} >Back to login page</Link></>}
          </div>
        </Form>
      </div>
    </div>
  </Formik> : null

  const secondContent = step === 2 ? <Otp setStep={setStep} /> : null
  const thirdConten = step === 3 ? <NewPasswordForm email={email} /> : null

  return (
    <>
      {contextHolder}
      {firstContent}
      {secondContent}
      {thirdConten}
    </>
  )
}
