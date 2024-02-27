import { Modal, Form, Input, Select, Space, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateProjectMutation } from '../../../../../redux/api/projectsApi';
import { useGetAllUsersQuery } from '../../../../../redux/api/userApi';
import { setCreateModal } from '../../../../../redux/features/modals/modalsSlice';


export const CreateModal = ({ openNotificationWithIcon }) => {

    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isCreateModalOpen } = modalsState;
    const { Option } = Select;
    const { data: data } = useGetAllUsersQuery();
    const [createProject] = useCreateProjectMutation();
    const dispatch = useDispatch();
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

        const resp = await createProject(values);

        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`)
            return;
        }

        openNotificationWithIcon('success', `Project successfully created!`);
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
        <Modal title="Create Project"
            open={isCreateModalOpen}
            onCancel={handleCreateCancel}
            footer={false}>
            <Form
                {...layout}
                form={form}
                name="create-project"
                onFinish={(values) => onFinish(values)}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item

                    name="projectName"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Project name is required !'
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="userIds"
                    label="Employees"
                    rules={[
                        {
                            required: true,
                            message: 'Choose minimum 1 employee !'
                        },
                    ]}
                >
                    <Select
                        placeholder="Select employees"
                        mode='multiple'
                    >
                        {data?.users.map((item, index) => (item.role.name === 'Employee' ?
                            <Option key={index} value={item.id}>{item.firstName + ' ' + item.lastName}</Option>
                            : null
                        ))}
                    </Select>
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
