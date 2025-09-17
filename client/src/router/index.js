import { createHashRouter } from 'react-router-dom';
import Home from '../view/home';
import Settings from '../view/settings-large';
import App from '../App';
import { Suspense } from 'react';

const router = createHashRouter([
    {
        path: '/',
        element: <App />, // 布局组件包含样式区域和路由出口
        children: [
            {
                path: '/', element: (
                    <Suspense fallback={<div>loading...</div>}>
                        <Home />
                    </Suspense>
                )
            },
        ]
    },
    {
        path: '/settings',
        element: <Settings />,
    }
]);

export default router;