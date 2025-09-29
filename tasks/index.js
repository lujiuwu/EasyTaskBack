const pages = require('../data/pages');
function getTasksByPage(req, res) {
  const pageNum = req.params.page;
  const pageData = pages.find(page => page.currentPage === parseInt(pageNum));
  
  if (!pageData) {
    return res.status(404).send({
      status: 404,
      message: '页面不存在',
      data: null
    });
  }
  
  res.send({
    status: 200,
    data: pageData,
    message: '获取任务成功',
  })
}

function getTaskById(req, res) {
  const taskId = req.params.id;
  console.log(taskId);
  
  // 遍历所有页面查找任务
  let taskData = null;
  for (const page of pages) {
    const task = page.data.find(task => task.id === parseInt(taskId));
    if (task) {
      taskData = task;
      break;
    }
  }
  
  if (!taskData) {
    return res.status(404).send({
      status: 404,
      message: '任务不存在',
      data: null
    });
  }
  
  res.send({
    status: 200,
    data: taskData,
    message: '获取任务成功',
  })
}

module.exports = {
  getTasksByPage,
  getTaskById
}; 