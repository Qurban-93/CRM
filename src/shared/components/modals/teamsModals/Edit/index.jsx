import { LoadingOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Space, Button, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useGetTeamByIdQuery, useEditTeamMutation } from '../../../../../redux/api/teamsApi';
import { useSelector, useDispatch } from 'react-redux';
import { setEditModal } from '../../../../../redux/features/modals/modalsSlice';
import './index.scss';


export const EditModal = ({ selectedTeamId, setSelectedTeamId, openNotificationWithIcon }) => {
    const { data: team, isLoading, isFetching } = useGetTeamByIdQuery(selectedTeamId);
    const [editTeam] = useEditTeamMutation();
    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isEditModalOpen } = modalsState;

    useEffect(() => {
        onSetValues();
    }, [team])

    const [form] = Form.useForm();

    const onSetValues = () => {
        form.setFieldsValue({
            teamName: team?.teamName,
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
        const data = { id: team.id, name: values.teamName }
        const resp = await editTeam(data);
        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`)
            return;
        }
        openNotificationWithIcon('success', 'Edited  successfully!')
        handleCancel();
    };


    const handleCancel = () => {
        dispatch(setEditModal(false));
        setSelectedTeamId(null)
    }

    return (
        <div>
            <Modal title="Edit team form"
                open={isEditModalOpen}
                centered
                footer={null}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                {isLoading || isFetching ? <Skeleton indicator={<LoadingOutlined style={{ fontSize: 24 }} Skeleton />} /> : <Form
                    {...layout}
                    form={form}
                    name="edit-project"
                    onFinish={(values) => onFinish(values)}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item

                        name="teamName"
                        label="Name"
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
