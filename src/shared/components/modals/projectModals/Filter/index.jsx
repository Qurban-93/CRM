import { Drawer, Space, Input, Form, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setFilterModal } from '../../../../../redux/features/modals/modalsSlice';
import './index.scss'

export const FilterModal = ({ setFilterValue, filterValue }) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isFilterModalOpen } = modalsState;


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

    const onClose = () => {
        dispatch(setFilterModal(false));
    }

    const onReset = () => {
        setFilterValue('');
    }

    const onFinish = ({ name }) => {
        setFilterValue(name);
    }

    return (
        <Drawer title="Project Filter" onClose={() => onClose()} open={isFilterModalOpen}>
            <Form
                {...layout}
                form={form}
                name="filter-for-projects"
                style={{
                    maxWidth: 600,
                }}
                onFinish={(value) => onFinish(value)}
            >
                <Form.Item
                    name="name"
                    initialValue={filterValue}
                >
                    <Input placeholder='Project name enter' />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Filter
                        </Button>
                        <Button onClick={onReset} type="primary">
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    )
}
