const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return successResponse(res, stars, '获取收藏夹列表成功');
});

module.exports = router;