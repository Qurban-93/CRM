import { Modal, Skeleton } from 'antd'
import { setDeleteModal } from '../../../../../redux/features/modals/modalsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserByIdQuery, useDeleteUserMutation } from '../../../../../redux/api/userApi';


const UserDeleteModal = ({ selectedUserId, setSelectedUserId, openNotificationWithIcon }) => {

    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isDeleteModalOpen } = modalsState;
    const { data: user, isLoading, isFetching } = useGetUserByIdQuery(selectedUserId);

    const [deleteUser] = useDeleteUserMutation();


    const onFinish = async () => {

        const userId = { id: [selectedUserId] }
        const resp = await deleteUser(userId);

        if (resp.error) {
            openNotificationWithIcon("error", "Something goes wrong!");
            return;
        }

        openNotificationWithIcon("success", "Deleted successfully!", `${user.firstName} ${user.lastName}`);
        onCancel();

    }

    const onCancel = () => {
        setSelectedUserId(null);
        dispatch(setDeleteModal(false))
    }

    return (
        <Modal title="Delete Confirmation"
            onOk={() => { onFinish() }}
            open={isDeleteModalOpen}
            onCancel={() => onCancel()}
            centered
            okType='danger'>
            {isLoading || isFetching ? <Skeleton /> : <p>Are you sure delete {user?.firstName} {user?.lastName} ?</p>}
        </Modal>
    )
}

export default UserDeleteModal;