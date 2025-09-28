const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const tasks = require('./tasks/index');

// 配置中间件
app.use(cors()); // 启用跨域支持
app.use(bodyParser.json()); // 解析 JSON 格式的请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析表单数据


app.get('/tasks', tasks.getTasksByPage);


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});


