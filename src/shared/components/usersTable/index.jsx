import { useNotification } from '../notification';
import { useMemo, useState } from 'react';
import { CreateFilterButtons } from '../createFilterButtons';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Skeleton, Pagination } from 'antd';
import { useGetAllUsersQuery, useChangeUserStatusMutation } from '@/redux/api/userApi';
import { EditOutlined, DeleteOutlined, UnlockOutlined, EyeOutlined } from '@ant-design/icons';
import { setDeleteModal, setEditModal, setResetPasswordModal, setViewModal } from '@/redux/features/modals/modalsSlice';
import { EditModal, DeleteModal, CreateModal, FilterModal, UserView, ResetPassword } from '../modals/userModals';

import './index.scss';

export const UsersTable = () => {

    const take = 5;
    const [current, setCurrent] = useState(1);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.userSlice);
    const { role } = user.profile;
    const { contextHolder, openNotificationWithIcon } = useNotification();
    const [filters, setFilters] = useState('');
    const [sortOrder] = useState('ascend');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [changeUserStatus] = useChangeUserStatusMutation();
    const { data: userData, isLoading, isFetching } =
        useGetAllUsersQuery(`?Skip=${(current - 1) * take}&Take=${take}` + filters);

    const totalPages = !isLoading ? Math.ceil(userData?.totalCount / take) : 1

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            sorter: (a, b) => {
                const order = sortOrder === 'ascend' ? 1 : -1;
                return a.firstName.localeCompare(b.firstName) * order
            }
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            sorter: (a, b) => {
                const order = sortOrder === 'ascend' ? 1 : -1;
                return a.lastName.localeCompare(b.lastName) * order
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => {
                const order = sortOrder === 'ascend' ? 1 : -1;
                return a.email.localeCompare(b.email) * order
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            sorter: (a, b) => {
                const order = sortOrder === 'ascend' ? 1 : -1;
                return a.role.name.localeCompare(b.role.name) * order
            },
            render(text, obj) {
                return obj.role.name;
            }
        },
        {
            title: 'Team',
            dataIndex: 'team',
            render(text, obj) {
                const team = obj.team ? obj.team.teamName : null
                return team ? team : "----"
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, object) => {
                if (role.name === 'Head') {
                    return object.isActive ?
                        <div style={{ cursor: 'default' }} className='active-user-btn'>Active</div> :
                        <div style={{ cursor: 'default' }} className='deactive-user-btn'>No active</div>
                }
                if (object.role.name !== 'SuperAdmin' && object.role.name !== 'Head') {
                    return object.isActive ?
                        <div onClick={() => onChangeStatus(object)} className='active-user-btn'>Active</div> :
                        <div onClick={() => onChangeStatus(object)} className='deactive-user-btn'>No active</div>
                } else {
                    return <div style={{ cursor: 'default' }} className='active-user-btn'>Active</div>
                }

            }
        },
        {
            title: 'Settings',
            dataIndex: 'settings',
            render: (text, object) => {
                if (role.name === 'Head') {
                    return <div className='setting-btns'>
                        <EyeOutlined
                            className='view-icon'
                            onClick={() => { onSelectUser(object.id); dispatch(setViewModal(true)) }} />
                    </div>
                }
                if (object.role.name !== 'SuperAdmin' && object.role.name !== 'Head') {
                    return <div className='setting-btns'>
                        <EditOutlined
                            className='edit-icon'
                            onClick={() => { onSelectUser(object.id); dispatch(setEditModal(true)); }}
                        />
                        <UnlockOutlined
                            className='reset-passowrd-icon'
                            onClick={() => { setSelectedUserId(object.id); dispatch(setResetPasswordModal(true)) }}
                        />
                        <EyeOutlined
                            className='view-icon'
                            onClick={() => { onSelectUser(object.id); dispatch(setViewModal(true)) }} />
                        <DeleteOutlined
                            className='delete-icon'
                            onClick={() => { onSelectUser(object.id), dispatch(setDeleteModal(true)) }}
                        />
                    </div>
                }
            }
        }
    ];

    const transformedUserDataForTable = useMemo(() => {
        return userData?.users?.map(item => ({
            key: item.id,
            email: item.email,
            lastName: item.lastName,
            firstName: item.firstName,
            id: item.id,
            isActive: item.isActive,
            role: item.role,
            team: item.team
        }))
    }, [userData?.users]);

    const onSelectUser = (id) => {
        setSelectedUserId(id);
    };

    const onChangeStatus = async (object) => {
        const newStatus = { id: object.id, isActive: !object.isActive };
        const resp = await changeUserStatus(newStatus);
        if (resp.error) {
            openNotificationWithIcon('error', "Something goes wrong!");
            return;
        }
        openNotificationWithIcon('success', "Status changed !");
    }

    const onPageChange = (page) => {
        setCurrent(page)
    }

    const editModal = selectedUserId ? <EditModal
        setSelectedUserId={setSelectedUserId}
        selectedUserId={selectedUserId}
        openNotificationWithIcon={openNotificationWithIcon} /> : null;

    const deleteModal = selectedUserId ? <DeleteModal
        setSelectedUserId={setSelectedUserId}
        selectedUserId={selectedUserId}
        openNotificationWithIcon={openNotificationWithIcon} /> : null

    const userViewModal = selectedUserId ? <UserView
        setSelectedUserId={setSelectedUserId}
        selectedUserId={selectedUserId} /> : null

    const resetPassword = selectedUserId ? <ResetPassword
        setSelectedUserId={setSelectedUserId}
        selectedUserId={selectedUserId}
        openNotificationWithIcon={openNotificationWithIcon}
    /> : null

    const table = isLoading || isFetching ? <Skeleton /> : <Table
        className='table'
        columns={columns}
        dataSource={transformedUserDataForTable}

        bordered
        pagination={false}
        loading={false}
    />

    const pagination = isLoading || isFetching ? null :
        <Pagination style={{ margin: 'auto', padding: '20px', textAlign: 'center' }}
            current={current} onChange={onPageChange} total={totalPages * 10} />

    return (
        <>
            <CreateFilterButtons title={'Employee list'} />
            {table}
            {pagination}
            <CreateModal openNotificationWithIcon={openNotificationWithIcon} />
            <FilterModal setCurrent={setCurrent} filters={filters} setFilters={setFilters} />
            {resetPassword}
            {editModal}
            {deleteModal}
            {userViewModal}
            {contextHolder}
        </>

    )
}
