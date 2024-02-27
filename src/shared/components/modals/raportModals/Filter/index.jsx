import { Drawer, Space, Select, Input, Form, Button } from 'antd';
import { useGetAllProjectsQuery } from '../../../../../redux/api/projectsApi';
import { useGetUserByIdQuery } from '../../../../../redux/api/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { setFilterModal } from '../../../../../redux/features/modals/modalsSlice';
import { useEffect, useState } from 'react';

import './index.scss'


export const FilterModal = ({ setFilters }) => {
    const dispatch = useDispatch();
    const [projects, setProjects] = useState([]);
    const { Option } = Select;
    const { user } = useSelector(state => state.userSlice);
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isFilterModalOpen } = modalsState;
    const { data: userData } = useGetUserByIdQuery(user.profile.id);
    const { data: projectsData } = useGetAllProjectsQuery();
    const role = user.profile.role.name;

    useEffect(() => {
        if (role === 'Employee') {
            setProjects(userData?.projects);
        } else {
            console.log('else');
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

    const onFinish = (value) => {
        const fullName = value.fullName ? value.fullName.trim() : '';
        const startDate = value.startDate ? value.startDate : '';
        const endDate = value.endDate ? value.startDate : '';
        let path = `&SearchByFullname=${fullName}&StartDate=${startDate}&EndDate=${endDate}`;

        if (value.projectId) {
            value.projectId.forEach(element => {
                path += `&ProjectIds=${element}`
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
                    name="fullName"
                    label='Full Name'
                >
                    <Input placeholder='Full name enter' />
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
                    name="projectId"
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
