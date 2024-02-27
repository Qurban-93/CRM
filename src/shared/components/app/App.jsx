import { Suspense, useEffect, useState } from 'react';
import { AppHeader } from '../../layout/Header/';
import { AppSideBarMenu } from '../../layout/SideMenu/';
import { useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import { useNavigate, useRoutes } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import routes from '../../../router/routes';
import PrivateRouter from '../../../pages/PrivateRouter';
import RenderIf from '../RenderIf/RenderIf';
import './app.scss';



function App() {

  const navigate = useNavigate();
  const { user } = useSelector(state => state.userSlice);
  const { Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.profile?.role.name;
  const routing = useRoutes(routes);


  useEffect(() => {
    !user.isAuth ? navigate('/') : null
  }, [user.isAuth])

  return (
    <>
      {user.profile == null && user.isAuth ? <Spinner /> : null}
      <RenderIf condition={user.isAuth && user.profile}>
        <Layout className='layout' style={{ width: '100%' }}>
          <Layout >
            <AppSideBarMenu collapsed={collapsed} />
            <Layout>
              <Content className='content'>
                <AppHeader user={user} collapsed={collapsed} setCollapsed={setCollapsed} />
                <Suspense>
                  <PrivateRouter role={role} />
                </Suspense>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </RenderIf>
      <RenderIf condition={!user.isAuth}>
        <Suspense fallback={<Spin />}>
          {routing}
        </Suspense>
      </RenderIf>
    </>
  );
}

export default App;