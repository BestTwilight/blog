@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════════════════
echo          🚀 NovaTech 博客项目完整启动脚本
echo ════════════════════════════════════════════════════════════════════
echo.
echo ✅ 新增内容: 8 篇示例技术文章已添加到数据库
echo ✅ 内容分类: Frontend(3), Backend(3), DevOps(1), AI(1)
echo ✅ 管理员账号: admin / password123
echo.
echo ════════════════════════════════════════════════════════════════════
echo.

REM 检查是否已在正确目录
if not exist "novatech-backend" (
    echo ⚠️  错误: 请在 d:\IT\code\blog 目录下运行此脚本
    echo.
    pause
    exit /b 1
)

echo 📦 启动步骤:
echo.
echo [1/2] 启动后端服务 (Spring Boot) ...
echo       地址: http://localhost:8080
echo       操作: 在新窗口中启动
echo.

REM 创建后端启动脚本
cd novatech-backend

REM 检查 Maven Wrapper 或 Maven
if exist "mvnw.cmd" (
    echo ✓ 检测到 Maven Wrapper
    start cmd /k "mvnw.cmd spring-boot:run"
) else if exist "mvn" (
    echo ✓ 检测到 Maven 命令
    start cmd /k "mvn spring-boot:run"
) else (
    echo ⚠️  未找到 Maven，尝试使用系统 Maven...
    start cmd /k "mvn spring-boot:run"
)

REM 等待后端启动
echo ⏳ 等待后端启动... (15 秒)
timeout /t 15 /nobreak

REM 回到项目根目录
cd ..

echo.
echo [2/2] 启动前端应用 (React Vite) ...
echo       地址: http://localhost:5173
echo       操作: 在新窗口中启动
echo.

REM 启动前端
cd novatech-blog
start cmd /k "npm run dev"
cd ..

echo.
echo ════════════════════════════════════════════════════════════════════
echo 🎉 启动完成！
echo ════════════════════════════════════════════════════════════════════
echo.
echo 📝 接下来的步骤:
echo    1. 前端窗口显示 "http://localhost:5173" 后，在浏览器打开该地址
echo    2. 首页应该显示 8 篇文章卡片
echo    3. 尝试点击分类过滤器查看不同分类的文章
echo    4. 点击文章卡片进入详情页
echo    5. 点击导航栏 "Write" 进行登录 (admin / password123)
echo    6. 登录后可以创建新文章
echo.
echo 🐛 常见问题:
echo    - 如果看不到文章，检查后端是否正常启动
echo    - 查看后端日志中是否有 "✅ Sample posts created"
echo    - 在浏览器打开 http://localhost:8080/api/posts 查看 API 数据
echo.
echo 📚 查看详细文档: 内容创作总结.txt
echo.
pause
