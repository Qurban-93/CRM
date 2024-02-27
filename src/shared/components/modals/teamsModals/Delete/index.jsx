import { Modal, Skeleton } from 'antd'
import { useGetTeamByIdQuery, useDeleteTeamMutation } from '../../../../../redux/api/teamsApi';
import { useSelector, useDispatch } from 'react-redux';
import { setDeleteModal } from '../../../../../redux/features/modals/modalsSlice';


export const DeleteModal = ({ selectedTeamId, setSelectedTeamId, setIsDeleteModalOpen, openNotificationWithIcon }) => {

    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isDeleteModalOpen } = modalsState;
    const { data: team, isLoading, isFetching } = useGetTeamByIdQuery(selectedTeamId);
    const [deleteTeam] = useDeleteTeamMutation();

    const onDelete = async () => {

        const resp = await deleteTeam({ ids: [selectedTeamId] });
        if (resp.error) {
            openNotificationWithIcon('error', `${resp.error.data.message}`)
            return;
        }

        openNotificationWithIcon('success', 'Deleted successfully!');
        onCancel();
    }

    const onCancel = () => {
        dispatch(setDeleteModal(false));
        setSelectedTeamId(null);
    }

    return (
        <Modal title="Delete Confirmation"
            open={isDeleteModalOpen}
            onCancel={() => onCancel()}
            onOk={onDelete}
            centered
            okType='danger'>
            {isLoading || isFetching ? <Skeleton /> : <p>Are you sure delete {team?.teamName} team ?</p>}
        </Modal>
    )
}
