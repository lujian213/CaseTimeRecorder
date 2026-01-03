const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

let mainWindow;

// 读取用户配置文件
function getUserConfig() {
  // C 盘 time-recorder 文件夹路径
  const configPath = path.join('C:', 'time-recorder', 'config.json');
  
  // 默认配置
  const defaultConfig = {
    userId: 'lujian',
    api: 'https://eggfund.website:9443/api'
  };

  try {
    // 检查配置文件是否存在
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const userConfig = JSON.parse(configContent);
      // 合并默认配置和用户配置
      return { ...defaultConfig, ...userConfig };
    } else {
      // 如果配置文件不存在，创建默认配置文件
      const configDir = path.dirname(configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      return defaultConfig;
    }
  } catch (error) {
    console.error('读取配置文件失败:', error);
    return defaultConfig;
  }
}

// 创建窗口函数
function createWindow() {
  // 隐藏菜单栏
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 340,          // 固定宽度
    height: 200,         // 固定高度
    frame: false,        // 隐藏原生标题栏
    resizable: false,    // 禁止调整大小
    maximizable: false,  // 禁止最大化
    alwaysOnTop: true,   // 窗口置顶
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // 预加载脚本
      contextIsolation: true,                       // 安全隔离
      nodeIntegration: false                        // 禁用Node集成
    }
  });

  // 打开开发者工具
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  // 加载React开发服务器
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);

  // 初始位置：右上角
  const { screen } = require('electron');
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow.setPosition(width - 360, 20);

  ipcMain.on('resize-window', (event, height) => {
    // 验证高度是否有效
    if (typeof height === 'number' && height > 100 && height < 2000) {
      // 只改变高度，保持宽度不变
      const [width] = mainWindow.getSize();
      mainWindow.setSize(width, height);
    }
  });
}

// IPC事件处理
// 获取用户配置
ipcMain.handle('user-config:get', () => {
  return getUserConfig();
});

// 窗口控制（最小化/关闭）
ipcMain.on('window:control', (event, action) => {
  if (!mainWindow) return;

  if (action === 'minimize') {
    mainWindow.minimize();
  } else if (action === 'close') {
    mainWindow.close();
  }
});

// 获取窗口位置（用于初始化）
ipcMain.handle('window:get-position', () => {
  if (!mainWindow) return { x: 0, y: 0 };
  return mainWindow.getPosition();
});

// 应用生命周期
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 监听打开新窗口的请求
ipcMain.on('open-new-window', (event, args) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // 创建新窗口
  const newWindow = new BrowserWindow({
    width: Math.round(width * 0.8),   // 宽度=屏幕的80%
    height: Math.round(height * 0.8),
    title: args.title || '新窗口',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 打开开发者工具（新窗口）
  newWindow.webContents.openDevTools({ mode: 'detach' });

  // 构建带路由的URL
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  const urlWithRoute = `${startUrl}#/${args.route}`; // 没有 /
  newWindow.loadURL(urlWithRoute);

  newWindow.on('closed', () => {
    // 可选：清理引用
  });

});