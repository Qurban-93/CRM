import { Drawer, Skeleton } from 'antd';
import { useGetTeamByIdQuery } from '../../../../../redux/api/teamsApi';
import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setViewModal } from '../../../../../redux/features/modals/modalsSlice';

export const ProjectView = ({ setSelectedTeamId, selectedTeamId }) => {

    const { data: team, isLoading, isFetching } = useGetTeamByIdQuery(selectedTeamId);
    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isViewModalOpen } = modalsState;



    const onClose = () => {
        setSelectedTeamId(null);
        dispatch(setViewModal(false))
    }

    return (
        <Drawer
            className='team-view-section'
            title="Team View"
            onClose={() => onClose()}
            open={isViewModalOpen}>
            {isLoading || isFetching ? <Skeleton /> :
                <>
                    <h1>Info</h1>
                    <p>Name : {team?.teamName}</p>
                    <h1>Users</h1>
                    <ul>
                        {team?.users.map(item => (<li>{item.fullName}</li>))}
                    </ul>
                </>
            }
        </Drawer>
    )
}

{/* <ul>
    <li>Name : {team?.teamName}</li>
    <li>--- User ---</li>
    {team?.users.map(item => (<li>{item.fullName}</li>))}
</ul> */}
