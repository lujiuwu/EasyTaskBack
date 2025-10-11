/**
 * 统一错误处理中间件
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // 处理 multer 错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 413,
      message: '文件过大',
      data: null
    });
  }
  
  // 处理 JSON 解析错误
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 400,
      message: '请求格式错误',
      data: null
    });
  }
  
  // 处理验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: '数据验证失败',
      data: err.message
    });
  }
  
  // 处理重复键错误
  if (err.code === 11000) {
    return res.status(409).json({
      status: 409,
      message: '数据已存在',
      data: null
    });
  }
  
  // 处理 CastError (MongoDB ObjectId 错误)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 400,
      message: '无效的ID格式',
      data: null
    });
  }
  
  // 默认错误处理
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
