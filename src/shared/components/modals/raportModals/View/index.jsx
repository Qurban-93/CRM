import { Drawer, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setViewModal } from '../../../../../redux/features/modals/modalsSlice';
import { useGetRaportByIdQuery } from '../../../../../redux/api/raportApi';
import './index.scss';


export const RaportView = ({ selectedRaportId }) => {

    const { data: raport, isLoading, isFetching } = useGetRaportByIdQuery(selectedRaportId);
    const dispatch = useDispatch();
    const { modalsState } = useSelector(state => state.modalsSlice);
    const { isViewModalOpen } = modalsState;

    return (
        <Drawer
            className='project-view-section'
            title="Raport View"
            onClose={() => dispatch(setViewModal(false))}
            open={isViewModalOpen}>
            {isLoading || isFetching ? <Skeleton /> :
                <div dangerouslySetInnerHTML={{ __html: 'Note' + raport.note }} />
            }
        </Drawer>
    )
}
