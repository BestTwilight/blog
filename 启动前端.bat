@echo off
chcp 65001 >nul
echo ================================================================================
echo                  启动 NovaTech 博客前端服务
echo ================================================================================
echo.
echo 前端应用将在 http://localhost:5173 启动
echo.

cd /d d:\IT\code\blog\novatech-blog

echo 启动 Vite 开发服务器...
echo.

npm run dev

pause
