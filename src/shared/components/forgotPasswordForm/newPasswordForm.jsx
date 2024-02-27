import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../notification';
import { LoadingOutlined } from '@ant-design/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { usePasswordConfirmationMutation } from "../../../redux/api/authApi";

import * as Yup from 'yup';
import "./index.scss";



export const NewPasswordForm = ({ email }) => {
    const [passwordConfirmation, { isLoading }] = usePasswordConfirmationMutation();
    const { contextHolder, openNotificationWithIcon } = useNotification();
    const navigate = useNavigate();

    const validation = Yup.object({
        newPassword: Yup.string()
            .min(8, 'Minimum length 8 simvols')
            .required('Required field!'),
        confirmNewPassword: Yup.string()
            .min(8, 'Minimum length 8 simvols')
            .required('Required field!')
    });



    const onEmailSubmit = async (values) => {
        const resp = await passwordConfirmation(values);
        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return;
        }
        passwordConfirmation('success', 'Password changed successfully!');
        navigate('/');
    }


    return (
        <>
            <Formik initialValues={
                {
                    email: email,
                    newPassword: "",
                    confirmNewPassword: ""
                }
            }
                validationSchema={validation}
                onSubmit={values => onEmailSubmit(values)}>
                <div className='login-section'>
                    <div className="login-form">
                        <h1>Reset password</h1>
                        <Form action="">
                            <label htmlFor="">New password</label>
                            <Field className="new-password" name="newPassword" type="password" placeholder="Enter password" />
                            <ErrorMessage component="div" className="error" name="newPassword" />
                            <label htmlFor="">Password confirmation</label>
                            <Field className="confirm-new-passwor" name="confirmNewPassword" type="password" placeholder="Enter password" />
                            <ErrorMessage component="div" className="error" name="confirmNewPassword" />
                            <div className="button-forgot">
                                {isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />} style={{ margin: 'auto', padding: '20px' }} /> : <><button type="submit">Save</button>
                                    <Link className='back-btn' to={'/'} >Back to login page</Link></>}
                            </div>
                        </Form>
                    </div>
                </div>
            </Formik>
            {contextHolder}
        </>
    )
}
