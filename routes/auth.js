/**
 * 认证路由模块
 */
const express = require('express');
const { body } = require('express-validator');
const { generateToken, authenticate } = require('../middleware/auth');
const { findByUsername, verifyPassword, updateLastLogin } = require('../data/users');
const validateRequest = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

/**
 * 登录验证规则
 */
const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6, max: 50 })
    .withMessage('密码长度必须在6-50个字符之间')
];

/**
 * 用户登录
 * POST /api/v1/auth/login
 */
router.post('/login', loginValidation, validateRequest, async (req, res) => {
  try {
    const { username, password } = req.body;
    // 查找用户
    const user = findByUsername(username);
    if (!user) {
      return errorResponse(res, '用户名或密码错误', 401, null);
    }
    
    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, '用户名或密码错误', 401, null);
    }
    
    // 更新最后登录时间
    updateLastLogin(user.id);
    
    // 生成JWT令牌
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });
    
    // 返回用户信息和令牌（不包含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      role: user.role,
      lastLoginAt: user.lastLoginAt
    };
    
    successResponse(res, {
      user: userInfo,
      token: token,
      expiresIn: '5m'
    }, '登录成功', 200);
    
  } catch (error) {
    console.error('登录错误:', error);
    errorResponse(res, '登录过程中发生错误', 500, null);
  }
});

/**
 * 获取当前用户信息
 * GET /api/v1/auth/me
 */
router.get('/me', authenticate, (req, res) => {
  try {
    successResponse(res, {
      user: req.user
    }, '获取用户信息成功', 200);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    errorResponse(res, '获取用户信息时发生错误', 500, null);
  }
});

/**
 * 用户登出
 * POST /api/v1/auth/logout
 */
router.post('/logout', authenticate, (req, res) => {
  try {
    // 在实际项目中，这里可以将令牌加入黑名单
    // 由于JWT是无状态的，客户端需要删除本地存储的令牌
    successResponse(res, null, '登出成功', 200);
  } catch (error) {
    console.error('登出错误:', error);
    errorResponse(res, '登出过程中发生错误', 500, null);
  }
});

/**
 * 验证令牌有效性
 * POST /api/v1/auth/verify
 */
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return errorResponse(res, '令牌不能为空', 400, null);
    }
    
    const { verifyToken } = require('../middleware/auth');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return errorResponse(res, '令牌无效或已过期', 401, null);
    }
    
    successResponse(res, {
      valid: true,
      user: {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      }
    }, '令牌有效', 200);
    
  } catch (error) {
    console.error('令牌验证错误:', error);
    errorResponse(res, '令牌验证过程中发生错误', 500, null);
  }
});

module.exports = router;
