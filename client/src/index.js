import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { RecoilRoot } from 'recoil';

// 初始化用户配置
async function initApp() {
  // 如果是 Electron 环境，通过 IPC 获取配置
  if (window.electronIPC && window.electronIPC.getUserConfig) {
    try {
      const userConfig = await window.electronIPC.getUserConfig();
      window.userConfig = userConfig;
    } catch (error) {
      console.error('获取用户配置失败:', error);
      // 使用默认配置
      window.userConfig = {
        userId: 'lujian',
        api: 'https://eggfund.website:9443/api'
      };
    }
  } else {
    // 非 Electron 环境，使用默认配置
    window.userConfig = {
      userId: 'lujian',
      api: 'https://eggfund.website:9443/api'
    };
  }

  // 配置加载完成后再导入 axiosSetup
  await import('./axiosSetup');

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </React.StrictMode>
  );
}

// 启动应用
initApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
