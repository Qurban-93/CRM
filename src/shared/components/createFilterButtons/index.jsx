import { FilterOutlined, PrinterOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setCreateModal, setFilterModal } from '../../../redux/features/modals/modalsSlice'

import './index.scss';


export const CreateFilterButtons = ({ title }) => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.userSlice);
    const location = useLocation();
    const { pathname } = location;
    const currentPageName = pathname.substring(1);

    const chekcForCreate =
        currentPageName === '' && user.profile.role.name === 'Employee' ||
        currentPageName !== 'raports' && user.profile.role.name !== 'Employee' && user.profile.role.name !== 'Head';

    const checkForFilter = currentPageName === 'teams';

    const createBtn = chekcForCreate ?
        <Tooltip placement="topLeft" title={'Create'}>
            <Button
                className='create-btn'
                onClick={() => { dispatch(setCreateModal(true)) }}>
                +
            </Button>
        </Tooltip> : null

    const filterBtn = checkForFilter ? null :
        <Tooltip placement="topLeft" title={'Filter'}>
            <Button
                onClick={() => dispatch(setFilterModal(true))}
                type="primary">
                <FilterOutlined />
            </Button>
        </Tooltip>

    const exportExcellBtn = currentPageName === 'raports' || currentPageName === '' && user.profile.role.name === 'Employee' ?
        <Tooltip placement="topLeft" title={'Export Excell'}>
            <Button
                onClick={() => dispatch(setFilterModal(true))}
                type="primary">
                <PrinterOutlined />
            </Button>
        </Tooltip> : null;


    return (
        <div className="table-header">
            <h1>{title}</h1>
            <div className='user-table-btns'>
                {exportExcellBtn}
                {filterBtn}
                {createBtn}
            </div>
        </div>
    )
}