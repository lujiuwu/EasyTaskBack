const express = require('express');
const stars = require('../data/star');
const { successResponse, serverErrorResponse } = require('../utils/response');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    return successResponse(res, stars, '获取收藏夹列表成功');
  } catch (error) {
    return serverErrorResponse(res, '获取收藏夹列表失败', error);
  }
});

module.exports = router;