import { Drawer, Space, Select, Input, Form, Button } from 'antd';
import { useGetAllProjectsQuery } from '@/redux/api/projectsApi';
import { useGetUserByIdQuery } from '@/redux/api/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { setFilterModal } from '@/redux/features/modals/modalsSlice';
import { useEffect, useState } from 'react';

import './index.scss'
import { useGetAllUsersQuery } from 'redux/api/userApi';


export const FilterModal = ({ setFilters }) => {
    const dispatch = useDispatch();
    const [projects, setProjects] = useState([]);
    const { Option } = Select;
    const { user } = useSelector(state => state.userSlice);
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isFilterModalOpen } = modalsState;
    const { data: userData } = useGetUserByIdQuery(user.profile.id);
    const { data: usersData } = useGetAllUsersQuery();
    const { data: projectsData } = useGetAllProjectsQuery();
    const role = user.profile.role.name;

    useEffect(() => {
        if (role === 'Employee') {
            setProjects(userData?.projects);
        } else {
            setProjects(projectsData?.projects);
        }
    }, [userData, projectsData]);


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
        dispatch(setFilterModal(false));
    }

    console.log(userData);

    const onFinish = (value) => {
        const startDate = value.startDate ? value.startDate : '';
        const endDate = value.endDate ? value.endDate : '';
        let path = `&StartDate=${startDate}&EndDate=${endDate}`;

        if (value.projectIds) {
            value.projectId.forEach(element => {
                path += `&ProjectIds=${element}`
            });
        }

        if (value.userIds) {
            value.userIds.forEach(element => {
                path += `&UserIds=${element}`
            });
        }

        setFilters(path);

    }

    const onResetFilter = () => {
        setFilters('');
        form.resetFields();
    }

    return (
        <Drawer title="Raport Filter" onClose={() => onClose()} open={isFilterModalOpen}>
            <Form
                {...layout}
                form={form}
                name="filter-for-teams"
                style={{
                    maxWidth: 600,
                }}
                onFinish={(value) => onFinish(value)}
            >
                {role !== 'Employee' ? <Form.Item
                    name="userIds"
                    label='Users'
                >
                    <Select
                        placeholder="Select Users"
                        mode='multiple'
                    >
                        {usersData?.users.map((item, index) => (
                            <Option key={index} value={item.id}>{item.firstName + ' ' + item.lastName}</Option>
                        ))}
                    </Select>
                </Form.Item> : null}
                <Form.Item
                    name="startDate"
                    label='Start date'
                >
                    <Input type='date' placeholder='Start date enter' />
                </Form.Item>
                <Form.Item
                    name="endDate"
                    label='End date'
                >
                    <Input type='date' placeholder='End date enter' />
                </Form.Item>
                <Form.Item
                    name="projectIds"
                    label='Projects'
                >
                    <Select
                        placeholder="Select Project"
                        mode='multiple'
                    >
                        {projects?.map((item, index) => (
                            <Option key={index} value={item.id}>{item.projectName}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Filter
                        </Button>
                        <Button onClick={() => { onResetFilter() }} type="primary">
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    )
}
