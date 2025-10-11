#!/bin/bash

# 启动 API 文档服务器
echo "正在启动 API 文档服务器..."
echo "文档地址: http://localhost:3000/api-docs.html"
echo "按 Ctrl+C 停止服务器"

# 检查是否已存在文档
if [ ! -f "api-docs.html" ]; then
    echo "正在生成 API 文档..."
    aglio -i api.apib -o api-docs.html
fi

# 启动 HTTP 服务器
python3 -m http.server 3000
