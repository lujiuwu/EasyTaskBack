const milestones = require('../data/milestones');

// 根据id获取milestones
function getMilestoneById(req, res) {
  const milestoneId = req.params.id;
  console.log('获取milestone ID:', milestoneId);
  
  const milestone = milestones.find(m => m.id === parseInt(milestoneId));
  
  if (!milestone) {
    return res.status(404).send({
      status: 404,
      message: '里程碑不存在',
      data: null
    });
  }
  
  res.send({
    status: 200,
    data: milestone,
    message: '获取里程碑成功'
  });
}

// 获取所有flags (这里flags指的是milestones)
function getAllFlags(req, res) {
  res.send({
    status: 200,
    data: milestones,
    message: '获取所有里程碑成功'
  });
}

module.exports = {
  getMilestoneById,
  getAllFlags
};
