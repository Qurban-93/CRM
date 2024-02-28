import { Form, Input, Select, Space, Button } from 'antd';
import { Modal } from 'antd';
import { useResetUserPasswordMutation } from '../../../../../redux/api/userApi';
import { setResetPasswordModal } from '../../../../../redux/features/modals/modalsSlice';
import { useSelector, useDispatch } from 'react-redux';

const ResetPassword = ({ openNotificationWithIcon, selectedUserId, setSelectedUserId }) => {
    const [resetUserPassword] = useResetUserPasswordMutation();
    const [form] = Form.useForm();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isResetPasswordModalOpen } = modalsState;
    const dispatch = useDispatch();

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
            openNotificationWithIcon('error', 'New password dont match with confirm password!');
            return;
        }
        const data = { ...values, userId: selectedUserId };
        const resp = await resetUserPassword(data);
        if (resp.error != null) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return;
        }
        openNotificationWithIcon('success', 'Password changed successfully!');
        onCancelOrFinish();
    }

    const onCancelOrFinish = () => {
        dispatch(setResetPasswordModal(false));
        form.resetFields();
        setSelectedUserId(null);
    }

    return (
        <Modal title="Reset Employee Password"
            open={isResetPasswordModalOpen}
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

export default ResetPassword