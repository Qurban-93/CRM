import { Drawer, Skeleton } from 'antd';
import { useGetProjectByIdQuery } from '@/redux/api/projectsApi';
import { useSelector, useDispatch } from 'react-redux';
import { setViewModal } from '@/redux/features/modals/modalsSlice';

import './index.scss';



export const ProjectView = ({ selectedProjectId }) => {
    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isViewModalOpen } = modalsState;
    const { data: data, isLoading, isFetching } = useGetProjectByIdQuery(selectedProjectId);

    const onClose = () => {
        dispatch(setViewModal(false));
    }

    return (
        <Drawer
            className='project-view-section'
            title="Project View"
            onClose={() => onClose()}
            open={isViewModalOpen}>
            {isLoading || isFetching ? <Skeleton /> :

                <>
                    <h2>Info </h2>
                    <p>Name : {data?.projectName}</p>
                    <h3>Users</h3>
                    <ul>
                        {data?.users.map(item => (
                            <li> {item.fullName}</li>))}
                    </ul>
                </>}
        </Drawer>
    )
}

{/* <ul>
    <li>Name : {data.projectName}</li>
    <li>---User---</li>
    
</ul> */}
