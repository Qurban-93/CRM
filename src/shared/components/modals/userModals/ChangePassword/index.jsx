import { Form, Input, Space, Button, Skeleton } from 'antd';
import { Modal } from 'antd';
import { useChangeUserPasswordMutation } from '../../../../../redux/api/userApi';

export const ChangePassword = ({ openNotificationWithIcon, isChangePasswordModalOpen, setIsChangePasswordModalOpen }) => {
    const [changeUserPassword] = useChangeUserPasswordMutation();
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const onFinish = async (values) => {
        if (values.newPassword !== values.newPasswordConfirm) {
            openNotificationWithIcon('error', 'The new password does not match the password confirmation')
            return;
        }

        const resp = await changeUserPassword(values);
        console.log(resp);
        if (resp.error != null) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return;
        }
        openNotificationWithIcon('success', 'Password changed successfully!');
        onCancelOrFinish();
    }

    const onCancelOrFinish = () => {
        setIsChangePasswordModalOpen(!isChangePasswordModalOpen);
        form.resetFields();
    }

    return (
        <Modal title="Change Password"
            open={isChangePasswordModalOpen}
            footer={null}
            destroyOnClose={true}
            onCancel={onCancelOrFinish}>
            <Form
                {...layout}
                form={form}
                name="reset-employee-password"
                onFinish={(values) => onFinish(values)}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item

                    name="oldPassword"
                    label="Old Password"

                    rules={[
                        {
                            required: true,
                            min: 8,
                            message: 'The password length must be at least 8!'
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>
                <Form.Item

                    name="newPassword"
                    label="New Password"

                    rules={[
                        {
                            required: true,
                            min: 8,
                            message: 'The password length must be at least 8!'
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>
                <Form.Item

                    name="newPasswordConfirm"
                    label="New passwrod confirm"

                    rules={[
                        {
                            required: true,
                            min: 8,
                            message: 'The password length must be at least 8!'
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Change Password
                        </Button>
                        <Button onClick={onCancelOrFinish} htmlType="button">
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal >
    )
}
