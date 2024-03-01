import { useDispatch } from 'react-redux';
import { useNotification } from '../notification';
import { Table, Skeleton, Pagination } from 'antd';
import { useMemo, useState } from 'react';
import { CreateFilterButtons } from '../createFilterButtons';
import { useGetAllProjectsQuery } from '@/redux/api/projectsApi';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { setEditModal, setViewModal } from '@/redux/features/modals/modalsSlice';
import { EditModal, CreateModal, FilterModal, ProjectView } from '../modals/projectModals';

import './index.scss';


export const ProjectTable = () => {
    const take = 5;
    const [current, setCurrent] = useState(1);
    const dispatch = useDispatch();
    const { contextHolder, openNotificationWithIcon } = useNotification();
    const [sortOrder] = useState('ascend');
    const [selectedProjectId, setSelectedProjectId] = useState();
    const [filterValue, setFilterValue] = useState('');
    const { data: data, isLoading, isFetching } =
        useGetAllProjectsQuery(filterValue + `&Skip=${take * (current - 1)}&Take=${take}`);

    const totalPages = !isLoading ? Math.ceil(data?.totalCount / take) : 1
    console.log(data);

    const transformDataForTable = useMemo(() => {
        return data?.projects.map(item => ({
            key: item.id,
            id: item.id,
            projectName: item.projectName
        }))
    }, [data?.projects])


    const columns = [
        {
            title: 'Name',
            dataIndex: 'projectName',

            sorter: (a, b) => {
                const order = sortOrder === 'ascend' ? 1 : -1;
                return a.projectName.localeCompare(b.projectName) * order
            }
        },
        {
            title: 'Settings',
            dataIndex: 'settings',
            render: (text, object) => (
                <div className='setting-btns'>
                    <EditOutlined
                        className='edit-icon'
                        onClick={() => { setSelectedProjectId(object.id); dispatch(setEditModal(true)); }}
                    />
                    <EyeOutlined
                        className='view-icon'
                        onClick={() => { setSelectedProjectId(object.id); dispatch(setViewModal(true)) }} />
                </div>
            )
        }
    ];

    const onPageChange = (page) => {
        setCurrent(page)
    }

    const editModal = selectedProjectId ? <EditModal
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        openNotificationWithIcon={openNotificationWithIcon} /> : null

    const viewProject = selectedProjectId ? <ProjectView
        selectedProjectId={selectedProjectId} /> : null

    const table = isLoading || isFetching ? <Skeleton /> :
        <Table
            scroll={{ y: 400, x: 500 }}
            columns={columns}
            dataSource={transformDataForTable}
            pagination={false} />

    const pagination = isLoading || isFetching ? null :
        <Pagination style={{ margin: 'auto', padding: '20px', textAlign: 'center' }}
            current={current} onChange={onPageChange} total={totalPages * 10} />


    return (
        <>
            <CreateFilterButtons title={'Project list'} />
            <CreateModal openNotificationWithIcon={openNotificationWithIcon} />
            <FilterModal setFilterValue={setFilterValue} filterValue={filterValue} />
            {contextHolder}
            {table}
            {pagination}
            {editModal}
            {viewProject}

        </>
    )
}
