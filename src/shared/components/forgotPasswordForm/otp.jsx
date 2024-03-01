import { InputOTP } from 'antd-input-otp';
import { useState, useEffect } from "react";
import { Button, Form } from "antd";
import { useSendOtpMutation } from '@/redux/api/authApi';
import { useNotification } from '../notification';


const Otp = ({ setStep, email }) => {
    const { contextHolder, openNotificationWithIcon } = useNotification();
    const [seconds, setSeconds] = useState(5 * 60);
    const [form] = Form.useForm();
    const [sendOtp] = useSendOtpMutation();

    useEffect(() => {
        const interval = seconds > 0 ? setInterval(() => {
            setSeconds(seconds => seconds - 1);
        }, 1000) : 0;
        return () => clearInterval(interval);
    }, [seconds])

    console.log('render');

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    const handleOtpFinish = async (values) => {
        if (seconds === 0) { alert('Time finish !'); return }
        const data = {
            otpCode: values.otpCode.reduce((total, item) => (total + item)),
            email: email
        }
        const resp = await sendOtp(data);

        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return
        }
        setStep(3);
    };

    return (
        <div className='login-section'>
            <div className="login-form">
                <h1>Please enter :</h1>
                <Form className="ant-form" onFinish={(values) => handleOtpFinish(values)} form={form}>
                    <Form.Item label="OTP" name="otpCode">
                        <InputOTP autoSubmit={form} inputType="numeric" />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
                <div>
                    <div style={{ color: 'red' }}>Time left : {formatTime(seconds)}</div>
                </div>
            </div>
            {contextHolder}
        </div>
    )
}

export default Otp