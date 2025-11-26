@echo off
echo ========================================
echo Fix and Start Backend
echo ========================================
echo.

echo [1/5] Killing all Java processes...
taskkill /F /IM java.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/5] Killing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 2^>nul') do (
    taskkill /PID %%a /F 2>nul
)
timeout /t 2 /nobreak >nul

echo.
echo [3/5] Cleaning target directory...
cd backend
if exist target (
    rmdir /s /q target 2>nul
    echo Target directory removed.
) else (
    echo Target directory not found.
)

echo.
echo [4/5] Building project...
call mvn clean package -DskipTests

echo.
echo [5/5] Starting Spring Boot...
call mvn spring-boot:run

pause

