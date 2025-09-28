const pages = require('../data/pages');
function getTasksByPage(req, res) {
  const pageNum = parseInt(req.params.page) || 1;
  const pageData = pages.find(page => page.currentPage === pageNum);
  res.send({
    status: 200,
    data: pageData,
    message: '获取任务成功',
  })
}

module.exports = {
  getTasksByPage
}; 