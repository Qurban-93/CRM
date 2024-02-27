import { Modal } from 'antd';
import { Form, Input, Select, Space, Button, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useGetProjectByIdQuery, useEditProjectMutation } from '../../../../../redux/api/projectsApi';
import { useGetAllUsersQuery } from '../../../../../redux/api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { setEditModal } from '../../../../../redux/features/modals/modalsSlice'



import './index.scss';

export const EditModal = ({ selectedProjectId, setSelectedProjectId, openNotificationWithIcon }) => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isEditModalOpen } = modalsState;
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


    const { data: project, isLoading, isFetching } = useGetProjectByIdQuery(selectedProjectId);
    const { data: usersData } = useGetAllUsersQuery();
    const [editProject] = useEditProjectMutation();

    useEffect(() => {
        project ? onSetValues() : null
    }, [project])

    const [form] = Form.useForm();


    const onSetValues = () => {

        form.setFieldsValue({
            projectName: project?.projectName
        })
    };



    const onFinish = async (values) => {

        const data = { ...values, id: selectedProjectId };
        const resp = await editProject(data);

        if (resp.error) {
            openNotificationWithIcon('error', 'Something goes wrong!', `${resp.error.data.message}`);
            return;
        }

        openNotificationWithIcon('success', 'Project edited successfully');
        handleCancel();

    };


    const handleCancel = () => {
        dispatch(setEditModal(false));
        setSelectedProjectId(null);
    }

    return (
        <div>

            <Modal title="Edit Project Form"
                open={isEditModalOpen}
                centered
                footer={null}
                onCancel={handleCancel}
                destroyOnClose={true}
            >{isLoading || isFetching ? <Skeleton /> :
                <Form
                    {...layout}
                    form={form}
                    name="edit-project"
                    onFinish={(values) => onFinish(values)}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item

                        name="projectName"
                        label="Project name"
                        rules={[
                            {
                                required: true,
                                message: 'Project name is required!'
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="users"
                        label="Users"
                        rules={[
                            {
                                required: true,
                                message: 'Minimum 1 user required!'
                            },
                        ]}
                        initialValue={project.users.map(item => (item.id))}
                    >
                        <Select
                            placeholder="Select users"
                            mode='multiple'
                        >
                            {usersData?.users.map((item, index) => (
                                item.role.name === 'Employee' ?
                                    <Option key={index} value={item.id}>{item.firstName + ' ' + item.lastName}</Option>
                                    : null
                            ))}
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
                </Form>}
            </Modal>
        </div>
    )
}
