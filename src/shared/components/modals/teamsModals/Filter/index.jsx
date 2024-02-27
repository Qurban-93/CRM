import { Drawer, Space, Select, Input, Form, Button } from 'antd';
import './index.scss'


export const FilterModal = ({ isFilterDrawerOpen, setIsFilterDrawerOpen, setFilter }) => {


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

    const onClose = () => {
        setIsFilterDrawerOpen(!isFilterDrawerOpen);
    }

    const onFinish = (value) => {
        setFilter(value.name)
    }

    return (
        <Drawer title="Teams Filter" onClose={() => onClose()} open={isFilterDrawerOpen}>
            <Form
                {...layout}
                form={form}
                name="filter-for-teams"
                style={{
                    maxWidth: 600,
                }}
                onFinish={(value) => onFinish(value)}
            >
                <Form.Item
                    name="name"
                >
                    <Input placeholder='Team name enter' />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Filter
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    )
}
