import { useEffect } from 'react';
import { setEditModal } from '@/redux/features/modals/modalsSlice';
import { useGetAllTeamsQuery } from '@/redux/api/teamsApi';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form, Input, Select, Space, Button, Skeleton } from 'antd';
import { useGetUserByIdQuery, useGetUserRolesQuery, useEditUserMutation } from '@/redux/api/userApi';


import './index.scss';

const UserEditModal = ({ selectedUserId, setSelectedUserId, openNotificationWithIcon }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [editUser] = useEditUserMutation();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isEditModalOpen } = modalsState;
    const { data: user, isLoading, isFetching } = useGetUserByIdQuery(selectedUserId);
    const { data: roles } = useGetUserRolesQuery();
    const { data: teams } = useGetAllTeamsQuery();
    const { Option } = Select;

    useEffect(() => {
        user ? onSetValues() : null
    }, [user]);

    const handleCancel = () => {
        form.resetFields();
        dispatch(setEditModal(false));
        setSelectedUserId(null);
    };

    const onSetValues = () => {
        form.setFieldsValue({
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            roleId: user?.role.id,
            teamId: user?.team ? user.team.id : '----'
        })

    };

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
        const resp = await editUser({ ...values, id: user.id });
        if (resp.error != null) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return;
        }
        openNotificationWithIcon('success', 'Edited successfully!')
        handleCancel();

    };

    const formView = isLoading || isFetching ? <Skeleton /> :
        <Form
            {...layout}
            form={form}
            name="edit-employee"
            onFinish={(values) => onFinish(values)}
            style={{
                maxWidth: 600,
            }}
        >
            <Form.Item

                name="firstName"
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item

                name="lastName"
                label="Surname"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item

                name="email"
                label="Email"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="teamId"
                label="Team"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    placeholder="Select teams"
                >
                    {teams?.teams.map((item, index) => (
                        <Option key={index} value={item.id}>{item.teamName}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="Role"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    placeholder="Select teams"
                >
                    {roles?.map((item, index) => item.name != 'SuperAdmin' && item.name != 'Head' ? (
                        <Option key={index} value={item.id}>{item.name}</Option>
                    ) : null)}
                </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>

    return (
        <div>
            <Modal title="Edit Employee Form"
                open={isEditModalOpen}
                centered
                footer={null}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                {formView}
            </Modal>
        </div>
    )
}

export default UserEditModal