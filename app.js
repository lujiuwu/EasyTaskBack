const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const multer = require('multer');

// 导入路由模块
const tasksRouter = require('./routes/tasks');
const milestonesRouter = require('./routes/milestones');
const starsRouter = require('./routes/stars');
const authRouter = require('./routes/auth');
// 导入中间件
const errorHandler = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

const app = express();

// 安全中间件
app.use(helmet());

// 压缩响应
app.use(compression());

// 请求日志
app.use(morgan('combined'));

// 跨域配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    status: 429,
    message: '请求过于频繁，请稍后再试',
    data: null
  }
});
app.use(limiter);

// 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 配置 multer 用于处理 form-data
const upload = multer();

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
    message: '服务运行正常',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// API 路由
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticate, upload.none(), tasksRouter);
app.use('/api/v1/milestones', authenticate, milestonesRouter);
app.use('/api/v1/stars', authenticate, starsRouter);
// 404 处理
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: '接口不存在',
    data: null
  });
});

// 全局错误处理中间件
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;