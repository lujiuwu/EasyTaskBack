const express = require('express');
const { body, param } = require('express-validator');
const milestones = require('../data/milestones');
const validateRequest = require('../middleware/validation');
const { 
  successResponse, 
  createdResponse, 
  noContentResponse, 
  notFoundResponse, 
  serverErrorResponse 
} = require('../utils/response');

const router = express.Router();

// 获取所有里程碑
// GET /api/v1/milestones
router.get('/', (req, res) => {
  try {
    return successResponse(res, milestones, '获取里程碑列表成功');
  } catch (error) {
    return serverErrorResponse(res, '获取里程碑列表失败', error);
  }
});

// 根据ID获取单个里程碑
// GET /api/v1/milestones/:id
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('里程碑ID必须是正整数'),
  validateRequest
], (req, res) => {
  try {
    const milestoneId = parseInt(req.params.id);
    
    const milestone = milestones.find(m => m.id === milestoneId);
    
    if (!milestone) {
      return notFoundResponse(res, '里程碑不存在');
    }
    
    return successResponse(res, milestone, '获取里程碑成功');
  } catch (error) {
    return serverErrorResponse(res, '获取里程碑失败', error);
  }
});

// 创建新里程碑
// POST /api/v1/milestones
router.post('/', [
  body('title').notEmpty().withMessage('里程碑标题不能为空'),
  body('description').optional().isString().withMessage('描述必须是字符串'),
  body('tasksId').optional().isArray().withMessage('任务ID必须是数组'),
  body('targetAt').optional().isISO8601().withMessage('目标日期格式无效'),
  body('mark').optional().isString().withMessage('备注必须是字符串'),
  validateRequest
], (req, res) => {
  try {
    const { title, description, tasksId, targetAt, mark } = req.body;
    
    // 生成新的里程碑ID
    const maxId = Math.max(...milestones.map(m => m.id));
    const newId = maxId + 1;
    
    const newMilestone = {
      id: newId,
      title,
      description: description || '',
      createdAt: new Date().toISOString().split('T')[0],
      tasksId: tasksId || [],
      targetAt: targetAt || null,
      mark: mark || ''
    };
    
    milestones.push(newMilestone);
    
    return createdResponse(res, newMilestone, '里程碑创建成功');
  } catch (error) {
    return serverErrorResponse(res, '创建里程碑失败', error);
  }
});

// 更新里程碑
// PUT /api/v1/milestones/:id
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('里程碑ID必须是正整数'),
  body('title').optional().notEmpty().withMessage('里程碑标题不能为空'),
  body('description').optional().isString().withMessage('描述必须是字符串'),
  body('tasksId').optional().isArray().withMessage('任务ID必须是数组'),
  body('targetAt').optional().isISO8601().withMessage('目标日期格式无效'),
  body('mark').optional().isString().withMessage('备注必须是字符串'),
  validateRequest
], (req, res) => {
  try {
    const milestoneId = parseInt(req.params.id);
    const updates = req.body;
    
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      return notFoundResponse(res, '里程碑不存在');
    }
    
    // 更新里程碑
    const updatedMilestone = {
      ...milestones[milestoneIndex],
      ...updates,
      id: milestoneId, // 确保ID不被修改
      createdAt: milestones[milestoneIndex].createdAt // 保持创建时间不变
    };
    
    milestones[milestoneIndex] = updatedMilestone;
    
    return successResponse(res, updatedMilestone, '里程碑更新成功');
  } catch (error) {
    return serverErrorResponse(res, '更新里程碑失败', error);
  }
});

// 删除里程碑
// DELETE /api/v1/milestones/:id
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('里程碑ID必须是正整数'),
  validateRequest
], (req, res) => {
  try {
    const milestoneId = parseInt(req.params.id);
    
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      return notFoundResponse(res, '里程碑不存在');
    }
    
    milestones.splice(milestoneIndex, 1);
    
    return noContentResponse(res);
  } catch (error) {
    return serverErrorResponse(res, '删除里程碑失败', error);
  }
});

module.exports = router;
