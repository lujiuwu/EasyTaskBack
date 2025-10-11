/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 * @param {number} statusCode - HTTP状态码
 */
const successResponse = (res, data = null, message = '操作成功', statusCode = 200) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data
  });
};

/**
 * 错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 * @param {*} data - 错误详情
 */
const errorResponse = (res, message = '操作失败', statusCode = 400, data = null) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data
  });
};

/**
 * 分页响应
 * @param {Object} res - Express响应对象
 * @param {Array} data - 数据数组
 * @param {Object} pagination - 分页信息
 * @param {string} message - 响应消息
 */
const paginatedResponse = (res, data, pagination, message = '获取数据成功') => {
  return res.json({
    status: 200,
    message,
    data,
    pagination
  });
};

/**
 * 创建成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 创建的数据
 * @param {string} message - 响应消息
 */
const createdResponse = (res, data, message = '创建成功') => {
  return successResponse(res, data, message, 201);
};

/**
 * 无内容响应
 * @param {Object} res - Express响应对象
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * 未找到响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
const notFoundResponse = (res, message = '资源不存在') => {
  return errorResponse(res, message, 404);
};

/**
 * 服务器错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {*} error - 错误详情
 */
const serverErrorResponse = (res, message = '服务器内部错误', error = null) => {
  console.error('Server Error:', error);
  return errorResponse(res, message, 500, process.env.NODE_ENV === 'development' ? error : null);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  notFoundResponse,
  serverErrorResponse
};
