const express = require('express');
const { body, param, query } = require('express-validator');
const pages = require('../data/pages');
const validateRequest = require('../middleware/validation');
const { 
  successResponse, 
  errorResponse, 
  createdResponse, 
  noContentResponse, 
  notFoundResponse, 
  serverErrorResponse 
} = require('../utils/response');

const router = express.Router();

// 获取所有任务（分页）
// GET /api/v1/tasks?page=1&limit=10
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  validateRequest
], (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const pageData = pages.find(p => p.currentPage === page);
    
    if (!pageData) {
      return notFoundResponse(res, '页面不存在');
    }
    
    // 根据limit限制返回的数据量
    const limitedData = {
      ...pageData,
      data: pageData.data.slice(0, limit)
    };
    
    return successResponse(res, limitedData, '获取任务列表成功');
  } catch (error) {
    return serverErrorResponse(res, '获取任务列表失败', error);
  }
});

// 根据ID获取单个任务
// GET /api/v1/tasks/:id
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('任务ID必须是正整数'),
  validateRequest
], (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    // 遍历所有页面查找任务
    let taskData = null;
    for (const page of pages) {
      const task = page.data.find(task => task.id === taskId);
      if (task) {
        taskData = task;
        break;
      }
    }
    
    if (!taskData) {
      return notFoundResponse(res, '任务不存在');
    }
    
    return successResponse(res, taskData, '获取任务成功');
  } catch (error) {
    return serverErrorResponse(res, '获取任务失败', error);
  }
});

// 创建新任务
// POST /api/v1/tasks
router.post('/', [
  body('title').notEmpty().withMessage('任务标题不能为空'),
  body('type').optional().isIn(['#FFFFFF', '#E0F2F1', '#FFCDD2', '#E3F2FD', '#EDE7F6']).withMessage('任务类型无效'),
  body('status').optional().isIn(['unfinished', 'finished']).withMessage('任务状态无效'),
  body('content').optional().isArray().withMessage('任务内容必须是数组'),
  body('chips').optional().isArray().withMessage('标签必须是数组'),
  validateRequest
], (req, res) => {
  try {
    const { title, type, status, content, chips } = req.body;
    
    // 生成新的任务ID（基于现有最大ID + 1）
    const allTasks = pages.flatMap(page => page.data);
    const maxId = Math.max(...allTasks.map(task => task.id));
    const newId = maxId + 1;
    
    const newTask = {
      id: newId,
      title,
      type: type || '#FFFFFF',
      status: status || 'unfinished',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      content: content || [],
      chips: chips || []
    };
    
    // 将新任务添加到第一页
    const firstPage = pages[0];
    firstPage.data.unshift(newTask);
    firstPage.total += 1;
    
    return createdResponse(res, newTask, '任务创建成功');
  } catch (error) {
    return serverErrorResponse(res, '创建任务失败', error);
  }
});

// 更新任务
// PUT /api/v1/tasks/:id
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('任务ID必须是正整数'),
  body('title').optional().notEmpty().withMessage('任务标题不能为空'),
  body('type').optional().isIn(['#FFFFFF', '#E0F2F1', '#FFCDD2', '#E3F2FD', '#EDE7F6']).withMessage('任务类型无效'),
  body('status').optional().isIn(['unfinished', 'finished']).withMessage('任务状态无效'),
  body('content').optional().isArray().withMessage('任务内容必须是数组'),
  body('chips').optional().isArray().withMessage('标签必须是数组'),
  validateRequest
], (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const updates = req.body;
    
    // 查找任务
    let taskData = null;
    let pageIndex = -1;
    let taskIndex = -1;
    
    for (let i = 0; i < pages.length; i++) {
      const task = pages[i].data.find((task, index) => {
        if (task.id === taskId) {
          taskIndex = index;
          return true;
        }
        return false;
      });
      if (task) {
        taskData = task;
        pageIndex = i;
        break;
      }
    }
    
    if (!taskData) {
      return notFoundResponse(res, '任务不存在');
    }
    
    // 更新任务
    const updatedTask = {
      ...taskData,
      ...updates,
      id: taskId, // 确保ID不被修改
      createTime: taskData.createTime // 保持创建时间不变
    };
    
    pages[pageIndex].data[taskIndex] = updatedTask;
    
    return successResponse(res, updatedTask, '任务更新成功');
  } catch (error) {
    return serverErrorResponse(res, '更新任务失败', error);
  }
});

// 删除任务
// DELETE /api/v1/tasks/:id
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('任务ID必须是正整数'),
  validateRequest
], (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    // 查找并删除任务
    let deleted = false;
    for (let i = 0; i < pages.length; i++) {
      const taskIndex = pages[i].data.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        pages[i].data.splice(taskIndex, 1);
        pages[i].total -= 1;
        deleted = true;
        break;
      }
    }
    
    if (!deleted) {
      return notFoundResponse(res, '任务不存在');
    }
    
    return noContentResponse(res);
  } catch (error) {
    return serverErrorResponse(res, '删除任务失败', error);
  }
});

module.exports = router;
