import { Form, Input, Select, Space, Button } from 'antd';
import React from 'react'
import { Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setCreateModal } from 'redux/features/modals/modalsSlice';
import { useCreateTeamMutation } from 'redux/api/teamsApi';

export const CreateModal = ({ openNotificationWithIcon }) => {

    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isCreateModalOpen } = modalsState;
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

    const [form] = Form.useForm();
    const [createTeam] = useCreateTeamMutation();
    const onFinish = async (values) => {
        const resp = await createTeam(values);
        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return;
        }
        openNotificationWithIcon('success', `Team ${values.teamName} created !`);
        handleCreateCancel();

    }

    const onReset = () => {
        form.resetFields();
    }

    const handleCreateCancel = () => {
        onReset();
        dispatch(setCreateModal(false));
    }

    return (
        <Modal title="Create Team"
            open={isCreateModalOpen}
            onCancel={handleCreateCancel}
            footer={null}>
            <Form
                {...layout}
                form={form}
                name="create-team"
                onFinish={(values) => onFinish(values)}
                style={{
                    maxWidth: 600,
                }}

            >
                <Form.Item

                    name="teamName"
                    label="Team name"
                    rules={[
                        {
                            required: true,
                            message: 'Team name is required!'
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                        <Button onClick={handleCreateCancel} htmlType="button">
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal >
    )
}
