import { Drawer, Skeleton } from 'antd';
import { useGetUserByIdQuery } from '../../../../../redux/api/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { setViewModal } from '../../../../../redux/features/modals/modalsSlice';

import './index.scss';



const UserView = ({ selectedUserId, setSelectedUserId }) => {

    const dispatch = useDispatch();
    const { data: user, isLoading, isFetching } = useGetUserByIdQuery(selectedUserId);
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isViewModalOpen } = modalsState;

    const onCloseView = () => {
        dispatch(setViewModal(false));
        setSelectedUserId(null);
    }

    return (
        <Drawer
            className='user-view-section'
            title="Employee View"
            onClose={() => onCloseView()}
            open={isViewModalOpen}>
            {isLoading || isFetching ? <Skeleton /> :
                <>
                    <h3>Personal Info</h3>
                    <ul>
                        <li>Full Name : {`${user.firstName} ${user.lastName}`}</li>
                        <li>Email : {user.email}</li>
                        <li>Role : {user.role.name}</li>
                        <li>Team : {user.team?.teamName}</li>
                        {/* <li>Projects :
                        {user.projects.map((item, index) =>
                            <span key={index}> {index + 1}-{item.projectName}</span>)}</li> */}
                    </ul>
                    <h3>Projects</h3>
                    {user.projects.map((item, index) =>
                        <p key={index}> <span className='count'>{index + 1}</span> - {item.projectName}</p>)}
                </>
            }
        </Drawer>
    )
}

export default UserView