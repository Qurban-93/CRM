import { useState } from "react";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/redux/features/user/userSlice"
import { Layout, Button, Space, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    UnlockOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';

import "./index.scss"
import { useNotification } from "shared/components/notification";
import { ChangePassword } from "shared/components/modals/userModals/ChangePassword";

export const AppHeader = ({ collapsed, setCollapsed, colorBgContainer, user }) => {

    const { contextHolder, openNotificationWithIcon } = useNotification();
    const { Header } = Layout;
    const dispatch = useDispatch();
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    const handleMenuClick = (e) => {
        if (e.key == '2') {
            dispatch(logOutUser(false))
        }
        if (e.key == '1') {
            setIsChangePasswordModalOpen(true);
        }
    };
    const changePasswordItem =
    {
        label: 'Change Password',
        key: '1',
        icon: <UnlockOutlined />
    };

    const items = [
        changePasswordItem,
        {
            label: 'Log Out',
            key: '2',
            icon: <LogoutOutlined />,
        }
    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <Header
            style={{
                background: colorBgContainer,
                width: '100%'
            }}
            className='header'
        >

            <Button
                className='collapse-btn'
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <Space>
                <Dropdown.Button className='user-info' menu={menuProps} placement="bottom" icon={<UserOutlined />}>
                    {user ? user.profile.firstName + ' ' + user.profile.lastName : 'Loading'}
                </Dropdown.Button>
            </Space>
            <ChangePassword
                isChangePasswordModalOpen={isChangePasswordModalOpen}
                setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
                openNotificationWithIcon={openNotificationWithIcon}
            />
            {contextHolder}
        </Header>
    )
}
