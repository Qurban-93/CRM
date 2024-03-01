import { Drawer, Space, Select, Input, Form, Button, Spin } from 'antd';
import { useGetAllTeamsQuery } from '@/redux/api/teamsApi';
import { useGetAllProjectsQuery } from '@/redux/api/projectsApi';
import { setFilterModal } from '@/redux/features/modals/modalsSlice';
import { useDispatch, useSelector } from 'react-redux';



import './index.scss'


const FilterModal = ({ setFilters, filters, setCurrent }) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const { values } = filters;
    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isFilterModalOpen } = modalsState;
    const { data: teams, isLoading: isLoadingTeams } = useGetAllTeamsQuery();
    const { data: projects, isLoading: isLoadingProjects } = useGetAllProjectsQuery();

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
        const firstName = values.firstName ? values.firstName.trim() : ''
        const lastName = values.lastName ? values.lastName.trim() : ''
        let path = `&FirstName=${firstName}&LastName=${lastName}`;

        if (values.projectIds?.length > 0) {
            values.projectIds.forEach(element => {
                path += `&ProjectIds=${element}`
            });
        }

        if (values.teamIds?.length > 0) {
            values.teamIds.forEach(element => {
                path += `&TeamIds=${element}`
            });
        }
        setCurrent(1);
        setFilters(path);
    }

    const onResetFilter = () => {
        form.resetFields();
        setFilters('');
    }

    const onClose = () => {
        dispatch(setFilterModal(false));
    }


    return (
        <Drawer title="Employee Filter"
            onClose={() => onClose()}
            open={isFilterModalOpen}>
            <Form
                {...layout}
                onFinish={(values) => onFinish(values)}
                form={form}
                name="filter-for-employee"
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item
                    name="firstName"
                >
                    <Input placeholder='First name' />
                </Form.Item>
                <Form.Item
                    name="lastName"
                >
                    <Input placeholder='Last name' />
                </Form.Item>

                {isLoadingTeams ? <Spin /> : <Form.Item
                    name='teamIds'
                >
                    <Select
                        placeholder="Select teams"
                        mode='multiple'
                        defaultValue={values?.teamIds}
                    >
                        {teams?.teams.map((item, index) => (
                            <Option key={index} value={item.id}>{item.teamName}</Option>
                        ))}
                    </Select>
                </Form.Item>}

                {isLoadingProjects ? <Spin /> : <Form.Item
                    name='projectIds'
                >
                    <Select
                        placeholder="Select project"
                        mode='multiple'
                        defaultValue={values?.projectIds}
                    >
                        {projects.projects.map((item, index) => (
                            <Option key={index} value={item.id}>{item.projectName}</Option>
                        ))}
                    </Select>
                </Form.Item>}

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Filter
                        </Button>
                        <Button onClick={() => { onResetFilter() }} type="primary" >
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default FilterModal