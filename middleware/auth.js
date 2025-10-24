/**
 * 认证中间件
 */
const jwt = require('jsonwebtoken');
const { findById } = require('../data/users');

// JWT密钥（实际项目中应该从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * 生成JWT令牌
 * @param {Object} payload - 载荷数据
 * @returns {string} JWT令牌
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '5m' // 5分钟过期
  });
};

/**
 * 验证JWT令牌
 * @param {string} token - JWT令牌
 * @returns {Object|null} 解码后的载荷或null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * 认证中间件 - 验证用户是否已登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const authenticate = (req, res, next) => {
  try {
    // 从请求头获取Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        message: '未提供认证令牌',
        data: null
      });
    }
    
    // 检查Bearer格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        status: 401,
        message: '认证令牌格式错误',
        data: null
      });
    }
    
    const token = parts[1];
    
    // 验证令牌
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 401,
        message: '认证令牌无效或已过期',
        data: null
      });
    }
    
    // 验证用户是否存在
    const user = findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: '用户不存在',
        data: null
      });
    }
    
    // 将用户信息添加到请求对象
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({
      status: 500,
      message: '认证过程中发生错误',
      data: null
    });
  }
};

/**
 * 角色验证中间件
 * @param {string|Array} roles - 允许的角色
 * @returns {Function} 中间件函数
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: '用户未认证',
        data: null
      });
    }
    
    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 403,
        message: '权限不足',
        data: null
      });
    }
    
    next();
  };
};

/**
 * 可选认证中间件 - 如果提供了令牌则验证，否则跳过
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }
    
    const token = parts[1];
    const decoded = verifyToken(token);
    
    if (decoded) {
      const user = findById(decoded.userId);
      if (user) {
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role
        };
      }
    }
    
    next();
  } catch (error) {
    // 可选认证失败时继续执行，不阻止请求
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  optionalAuth
};
