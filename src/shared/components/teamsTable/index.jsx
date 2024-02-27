import { useDispatch } from 'react-redux';
import { Skeleton, Table } from 'antd';
import { useNotification } from '../notification';
import { useMemo, useState } from 'react';
import { useGetAllTeamsQuery } from '../../../redux/api/teamsApi';
import { CreateFilterButtons } from '../createFilterButtons';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { setDeleteModal, setEditModal, setViewModal } from '../../../redux/features/modals/modalsSlice';
import { EditModal, CreateModal, DeleteModal, ProjectView } from '../modals/teamsModals';

import './index.scss';

export const TeamsTable = () => {
    const dispatch = useDispatch();
    const { contextHolder, openNotificationWithIcon } = useNotification();
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const { data } = useGetAllTeamsQuery();

    const transformedTeamsDataForTable = useMemo(() => {
        return data?.teams.map(item => ({
            key: item.id,
            id: item.id,
            teamName: item.teamName
        }))
    }, [data?.teams]);

    const columns = [
        {
            title: 'Team name',
            dataIndex: 'teamName',
        },
        {
            title: 'Settings',
            dataIndex: 'settings',
            render: (text, object) => (
                <div className='setting-btns'>
                    <EditOutlined
                        className='edit-icon'
                        onClick={() => { setSelectedTeamId(object.id); dispatch(setEditModal(true)) }}
                    />
                    <EyeOutlined
                        className='view-icon'
                        onClick={() => { setSelectedTeamId(object.id); dispatch(setViewModal(true)) }} />
                    <DeleteOutlined
                        className='delete-icon'
                        onClick={() => { setSelectedTeamId(object.id); dispatch(setDeleteModal(true)) }}
                    />
                </div>
            )
        }
    ];

    const deleteModal = selectedTeamId ? <DeleteModal
        selectedTeamId={selectedTeamId}
        openNotificationWithIcon={openNotificationWithIcon}
        setSelectedTeamId={setSelectedTeamId} /> : null

    const editModal = selectedTeamId ? <EditModal
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
        openNotificationWithIcon={openNotificationWithIcon} /> : null

    const projectView = selectedTeamId ? <ProjectView
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
    /> : null

    const table = data ? <Table
        loading={false}
        scroll={{ y: 400, x: 500 }}
        columns={columns}
        dataSource={transformedTeamsDataForTable}
        pagination={false} /> : <Skeleton />

    return (
        <>

            <CreateFilterButtons title={'Teams list'} />
            <CreateModal openNotificationWithIcon={openNotificationWithIcon} />
            {table}
            {projectView}
            {editModal}
            {deleteModal}
            {contextHolder}
        </>
    )
}
