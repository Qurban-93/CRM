import { Table, Skeleton, Pagination } from 'antd';
import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { EditModal, CreateModal, FilterModal, RaportView } from '../modals/raportModals';
import { CreateFilterButtons } from '../createFilterButtons';
import { useGetAdminRaportQuery, useGetUserRaportsQuery } from '../../../redux/api/raportApi';
import { useNotification } from '../notification/index';
import { setViewModal, setEditModal } from '../../../redux/features/modals/modalsSlice';



import './index.scss';


export const RaportTable = () => {
    const isDatePassed = (dateString) => {
        const parts = dateString.split('-');
        const date = new Date(parts[2], parts[1] - 1, parts[0]); // parts[2] - год, parts[1] - месяц, parts[0] - день
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        const currentDate = new Date();
        return date < currentDate;
    }
    const take = 5;

    const [curretntPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState('');
    const [selectedRaportId, setSelectedRaportId] = useState();
    const { contextHolder, openNotificationWithIcon } = useNotification();
    const { user } = useSelector(state => state.userSlice);
    const checkRole = user.profile.role.name === 'Employee';
    const { data: raportsData, isFetching, isLoading } = checkRole ?
        useGetUserRaportsQuery(`?Skip=${(curretntPage - 1) * take}&Take=${take}` + filters) :
        useGetAdminRaportQuery(`?Skip=${(curretntPage - 1) * take}&Take=${take}` + filters);
    const totalPages = !isLoading ? Math.ceil(raportsData.totalCount / take) : 1

    console.log(raportsData);

    const transformedDataForTable = useMemo(() => {
        return raportsData?.reports.map(item => ({
            key: item.id,
            id: item.id,
            employee: item.user.fullName,
            createdDate: item.createdDate,
            note: item.note,
            project: item.projectName
        }))
    }, [raportsData?.reports])

    const columns = user.profile.role.name !== 'Employee' ? [
        {
            title: 'Employee',
            dataIndex: 'employee',
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            sortDirections: ['descend'],
        },
        {
            title: 'Project',
            dataIndex: 'project',
        },
        {
            title: 'Create Date',
            dataIndex: 'createdDate',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            onFilter: (value, record) => record.address.indexOf(value) === 0,
            render: text => <div dangerouslySetInnerHTML={{ __html: text }} />
        },
        {
            title: 'Settings',
            dataIndex: 'settings',
            render: (text, object) => (
                <div className='setting-btns'>
                    <EyeOutlined
                        className='view-icon'
                        onClick={() => { setSelectedRaportId(object.id); dispatch(setViewModal(true)) }}
                    />
                </div>
            )
        }
    ] : [
        {
            title: 'Project',
            dataIndex: 'project',
        },
        {
            title: 'Create Date',
            dataIndex: 'createdDate',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            onFilter: (value, record) => record.address.indexOf(value) === 0,
            render: text => <div dangerouslySetInnerHTML={{ __html: text }} />
        },
        {
            title: 'Settings',
            dataIndex: 'settings',
            render: (text, object) => (
                <div className='setting-btns'>
                    {isDatePassed(object?.createdDate) ? null : <EditOutlined
                        className='edit-icon'
                        onClick={() => { setSelectedRaportId(object.id), dispatch(setEditModal(true)) }}
                    />}
                    <EyeOutlined
                        className='view-icon'
                        onClick={() => { setSelectedRaportId(object.id); dispatch(setViewModal(true)) }}
                    />
                </div>
            )
        }
    ]

    const onPageChange = (page) => {
        setCurrentPage(page)
    }

    const editRaport = selectedRaportId ? <EditModal
        selectedRaportId={selectedRaportId}
        setSelectedRaportId={setSelectedRaportId}
        openNotificationWithIcon={openNotificationWithIcon}
    /> : null

    const raportView = selectedRaportId ? <RaportView
        selectedRaportId={selectedRaportId}
    /> : null

    const table = isFetching || isLoading ? <Skeleton /> : <Table
        scroll={{ y: 400, x: 500 }}
        pagination={false}
        columns={columns}
        dataSource={transformedDataForTable} />;

    const pagination = isLoading || isFetching ? null :
        <Pagination style={{ margin: 'auto', padding: '20px', textAlign: 'center' }}
            current={curretntPage} onChange={onPageChange} total={totalPages * 10} />


    return (
        <>
            <CreateFilterButtons title={'Raports list'} />
            <CreateModal openNotificationWithIcon={openNotificationWithIcon} />
            <FilterModal setFilters={setFilters} />
            {table}
            {pagination}
            {editRaport}
            {raportView}
            {contextHolder}

        </>
    )

}
