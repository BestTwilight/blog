@echo off
chcp 65001 >nul
echo ================================================================================
echo                  启动 NovaTech 博客后端服务
echo ================================================================================
echo.
echo 正在启动 Spring Boot 应用...
echo.

cd /d d:\IT\code\blog\novatech-backend

echo 方法1: 尝试使用 Maven Wrapper (推荐)
if exist "mvnw.cmd" (
    echo 发现 Maven Wrapper，正在使用...
    call mvnw.cmd spring-boot:run
    exit /b
)

echo.
echo 方法2: 使用系统 Maven
mvn spring-boot:run

pause
