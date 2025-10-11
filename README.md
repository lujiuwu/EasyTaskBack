# EasyTask Backend API

基于 RESTful 规范的任务管理系统后端 API。

## 功能特性

- ✅ 完整的任务 CRUD 操作
- ✅ 里程碑管理
- ✅ 分页查询
- ✅ 请求验证
- ✅ 统一错误处理
- ✅ 安全中间件
- ✅ API 文档生成

## 技术栈

- Node.js + Express
- express-validator (请求验证)
- helmet (安全中间件)
- morgan (请求日志)
- express-rate-limit (速率限制)
- multer (文件上传)
- compression (响应压缩)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务器

```bash
npm start
# 或者
node app.js
```

服务器将在 `http://localhost:8080` 启动

### 健康检查

```bash
curl http://localhost:8080/health
```

## API 文档

### 在线文档

启动文档服务器：

```bash
./start-docs.sh
```

然后访问：http://localhost:3000/api-docs.html

### 重新生成文档

```bash
aglio -i api.apib -o api-docs.html
```

## API 端点

### 任务管理

- `GET /api/v1/tasks` - 获取任务列表（分页）
- `GET /api/v1/tasks/:id` - 获取单个任务
- `POST /api/v1/tasks` - 创建任务（支持 form-data）
- `PUT /api/v1/tasks/:id` - 更新任务
- `DELETE /api/v1/tasks/:id` - 删除任务

### 里程碑管理

- `GET /api/v1/milestones` - 获取里程碑列表
- `GET /api/v1/milestones/:id` - 获取单个里程碑
- `POST /api/v1/milestones` - 创建里程碑
- `PUT /api/v1/milestones/:id` - 更新里程碑
- `DELETE /api/v1/milestones/:id` - 删除里程碑

## 响应格式

所有 API 响应都遵循统一格式：

```json
{
  "status": 200,
  "message": "操作成功",
  "data": {}
}
```

## 错误处理

- `400` - 请求参数错误
- `404` - 资源不存在
- `429` - 请求过于频繁
- `500` - 服务器内部错误

## 项目结构

```
├── app.js                 # 主应用文件
├── routes/               # 路由模块
│   ├── tasks.js         # 任务路由
│   └── milestones.js    # 里程碑路由
├── middleware/           # 中间件
│   ├── errorHandler.js  # 错误处理
│   └── validation.js    # 请求验证
├── utils/               # 工具函数
│   └── response.js      # 响应格式化
├── data/                # 静态数据
│   ├── pages.js         # 任务分页数据
│   └── milestones.js    # 里程碑数据
├── api.apib            # API Blueprint 文档
├── api-docs.html       # 生成的 HTML 文档
└── start-docs.sh       # 文档服务器启动脚本
```

## 开发说明

### 添加新接口

1. 在对应的路由文件中添加新的路由
2. 使用 `express-validator` 进行参数验证
3. 使用统一的响应格式工具
4. 更新 `api.apib` 文档
5. 重新生成 HTML 文档

### 数据持久化

当前使用内存存储，生产环境建议使用数据库（如 MongoDB、PostgreSQL 等）。

## 许可证

MIT