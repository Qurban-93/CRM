import { Modal, Form, Input, Select, Space, Button, } from 'antd';
import { useGetUserByIdQuery } from '@/redux/api/userApi';
import { useCreateRaportMutation } from '@/redux/api/raportApi';
import { useSelector, useDispatch } from 'react-redux';
import { setCreateModal } from '@/redux/features/modals/modalsSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export const CreateModal = ({ openNotificationWithIcon }) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { Option } = Select;


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

    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isCreateModalOpen } = modalsState;
    const { user } = useSelector(state => state.userSlice);
    const { data: userData } = useGetUserByIdQuery(user.profile.id);
    const [createRaport] = useCreateRaportMutation();
    const projects = userData?.projects;

    const onFinish = async (values) => {

        const resp = await createRaport(values);

        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`);
            return;
        }

        openNotificationWithIcon('success', `Raport created successfully!`);
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
        <Modal title="Create Raport"
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

                    name="note"
                    label="Note"
                    rules={[
                        {
                            required: true,
                            message: 'Not empty !'
                        },
                    ]}
                >
                    <ReactQuill theme="snow" />
                </Form.Item>
                <Form.Item
                    name="projectId"
                    label="Project"
                    rules={[
                        {
                            required: true,
                            message: 'Project is required!'
                        },
                    ]}
                >
                    <Select
                        placeholder="Select Project"
                    >
                        {projects?.map((item, index) => (
                            <Option key={index} value={item.id}>{item.projectName}</Option>
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
