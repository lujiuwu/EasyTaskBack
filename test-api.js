const http = require('http');

// 测试函数
async function testAPI(page) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/tasks/${page}`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: result
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 执行测试
async function runTests() {
  console.log('开始测试API接口...\n');
  
  try {
    // 测试有效页面
    for (let page = 1; page <= 4; page++) {
      console.log(`测试第${page}页:`);
      const result = await testAPI(page);
      console.log(`状态码: ${result.statusCode}`);
      console.log(`数据条数: ${result.data.data?.data?.length || 0}`);
      console.log(`总页数: ${result.data.data?.totalPages || 0}`);
      console.log('---');
    }
    
    // 测试无效页面
    console.log('测试第5页（应该返回404）:');
    const errorResult = await testAPI(5);
    console.log(`状态码: ${errorResult.statusCode}`);
    console.log(`错误信息: ${errorResult.data.message}`);
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

runTests();
