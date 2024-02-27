import { useEffect } from 'react';
import { Modal } from 'antd';
import { Form, Space, Button, Skeleton } from 'antd';
import { useGetRaportByIdQuery, useEditRaportMutation } from '../../../../../redux/api/raportApi';
import { useSelector, useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import './index.scss';
import { setEditModal } from '../../../../../redux/features/modals/modalsSlice';


export const EditModal = ({ openNotificationWithIcon, selectedRaportId, setSelectedRaportId }) => {

    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isEditModalOpen } = modalsState;
    const { data: raport, isLoading, isFetching } = useGetRaportByIdQuery(selectedRaportId);
    const [editRaport] = useEditRaportMutation();

    useEffect(() => {
        onSetValues();
    }, [raport]);

    const [form] = Form.useForm();

    const onSetValues = () => {

        form.setFieldsValue({
            note: raport?.note,
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
        console.log({ ...values, id: selectedRaportId });
        const resp = await editRaport({ ...values, id: selectedRaportId });
        console.log(resp);
        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`)
            return;
        }
        openNotificationWithIcon('success', 'Edited saved!');
        setSelectedRaportId(null);
        handleCancel();
    };


    const handleCancel = () => {
        dispatch(setEditModal(false));
    }

    return (
        <div>
            <Modal title="Edit raport form"
                open={isEditModalOpen}
                centered
                footer={null}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                {isLoading || isFetching ? <Skeleton /> : <Form
                    {...layout}
                    form={form}
                    name="edit-raport"
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
                                message: 'Note is required!'
                            },
                        ]}
                    >
                        <ReactQuill theme="snow" />
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
