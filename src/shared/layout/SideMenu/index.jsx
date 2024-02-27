import { useSelector } from 'react-redux';
import { Layout, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
    InfoCircleOutlined,
    UserOutlined,
    VideoCameraOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import './index.scss';


export const AppSideBarMenu = ({ collapsed }) => {

    const { user } = useSelector(state => state.userSlice);
    const { pathname } = useLocation();
    const { Sider } = Layout;
    const check = user?.profile.role.name === 'Employee';
    const items = check ? [
        {
            key: '/',
            label: <NavLink to="/">Daily Report</NavLink>,
            icon: <InfoCircleOutlined />
        }] : [
        {
            key: '/',
            label: <NavLink to="/">Users</NavLink>,
            icon: <UserOutlined />
        },
        {
            key: '/projects',
            label: <NavLink to="/projects">Projects</NavLink>,
            icon: <VideoCameraOutlined />
        },
        {
            key: '/teams',
            label: <NavLink to="/teams">Teams</NavLink>,
            icon: <TeamOutlined />
        },
        {
            key: '/raports',
            label: <NavLink to="/raports">Daily Report</NavLink>,
            icon: <InfoCircleOutlined />
        }
    ]

    return (
        <Sider className='side-bar' trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[pathname]}
                items={items} />
        </Sider>
    )
}
