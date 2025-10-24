/**
 * 用户数据存储模块
 */
const bcrypt = require('bcryptjs');

// 默认用户数据
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$hg2ms5JT9voBVYcqEtDtoeat8oILBI5XnIx.jvbLBKSE0Y2G2xHU6', // 123456 的哈希值
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLoginAt: null
  }
];

// 用户存储（实际项目中应该使用数据库）
let users = [...defaultUsers];

/**
 * 根据用户名查找用户
 * @param {string} username - 用户名
 * @returns {Object|null} 用户对象或null
 */
const findByUsername = (username) => {
  return users.find(user => user.username === username) || null;
};

/**
 * 根据ID查找用户
 * @param {number} id - 用户ID
 * @returns {Object|null} 用户对象或null
 */
const findById = (id) => {
  return users.find(user => user.id === id) || null;
};

/**
 * 验证用户密码
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 哈希密码
 * @returns {Promise<boolean>} 密码是否正确
 */
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * 更新用户最后登录时间
 * @param {number} userId - 用户ID
 */
const updateLastLogin = (userId) => {
  const user = findById(userId);
  if (user) {
    user.lastLoginAt = new Date().toISOString();
  }
};

/**
 * 创建新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object>} 创建的用户对象
 */
const createUser = async (userData) => {
  const { username, password, role = 'user' } = userData;
  
  // 检查用户名是否已存在
  if (findByUsername(username)) {
    throw new Error('用户名已存在');
  }
  
  // 生成密码哈希
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
    lastLoginAt: null
  };
  
  users.push(newUser);
  
  // 返回用户数据（不包含密码）
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * 获取所有用户（不包含密码）
 * @returns {Array} 用户列表
 */
const getAllUsers = () => {
  return users.map(({ password, ...user }) => user);
};

module.exports = {
  findByUsername,
  findById,
  verifyPassword,
  updateLastLogin,
  createUser,
  getAllUsers
};
