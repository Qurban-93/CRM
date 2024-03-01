import { setCreateModal } from '@/redux/features/modals/modalsSlice';
import { useGetAllTeamsQuery } from '@/redux/api/teamsApi';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form, Input, Select, Space, Button } from 'antd';
import { useCreateUserMutation, useGetUserRolesQuery } from '@/redux/api/userApi';

const CreateModal = ({ openNotificationWithIcon }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.userSlice);
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isCreateModalOpen } = modalsState;
    const { Option } = Select;
    const { data: roles } = useGetUserRolesQuery();
    const { data: teamsData } = useGetAllTeamsQuery();

    const [form] = Form.useForm();
    const [createUser] = useCreateUserMutation();

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


    const checkPermission = () => {
        if (user?.profile.role.name.includes('SuperAdmin')) {
            return roles?.filter(item => item.name != 'SuperAdmin');
        }

        if (user?.profile.role.name.includes('Admin')) {
            return roles?.filter(item => item.name != 'SuperAdmin' && item.name != 'Admin' && item.name != 'Head');
        }
    }

    const onFinish = async (values) => {
        const resp = await createUser(values);

        if (resp?.error?.status == 400) {
            openNotificationWithIcon('error', "Sehv daxil etmisiz!", resp?.error.data.message);
            return;
        }

        openNotificationWithIcon('success', "Ugurlu emeliyyat!");


        onReset();
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
        <Modal title="Create Employee"
            open={isCreateModalOpen}
            onCancel={() => handleCreateCancel()}
            footer={null}>
            <Form
                {...layout}
                form={form}
                name="create-employee"
                onFinish={(values) => onFinish(values)}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item

                    name="firstName"
                    label="First Name"
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
                    label="Last Name"
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

                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input type='password' />
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
                        placeholder="Select role"
                    >
                        {checkPermission()?.map((item, index) => (
                            <Option key={index} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="teamId"
                    label="Teams"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Select team"
                    >
                        <Option key={0} >---</Option>
                        {teamsData?.teams.map((item) => (
                            <Option key={item.id} value={item.id}>{item.teamName}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                        <Button onClick={() => handleCreateCancel()} htmlType="button">
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal >
    )
}

export default CreateModal