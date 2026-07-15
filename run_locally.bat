@echo off
SETLOCAL EnableDelayedExpansion

echo Starting Speak2HR setup and run script...

:: Check for Python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.8+ and add it to your PATH.
    pause
    exit /b
)

:: Check for Node.js
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm (Node.js) not found. Please install Node.js 16+ and add it to your PATH.
    pause
    exit /b
)

:: Setup Backend
echo.
echo === Setting up Backend (ML) ===
cd ML
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

:: Check for .env in Backend
if not exist .env (
    echo [WARNING] .env file not found in ML folder.
    if exist .env.example (
        echo Copying .env.example to .env ...
        copy .env.example .env
        echo [IMPORTANT] Please add your Gemini API keys to ML/.env
    ) else (
        echo [ERROR] .env.example not found. Please create ML/.env manually.
    )
)
cd ..

:: Setup Frontend
echo.
echo === Setting up Frontend ===
cd frontend
if not exist node_modules (
    echo Installing Node dependencies (this may take a while)...
    call npm install
)

:: Check for .env in Frontend
if not exist .env (
    echo [WARNING] .env file not found in frontend folder.
    if exist .env.example (
        echo Copying .env.example to .env ...
        copy .env.example .env
    ) else (
        echo [ERROR] .env.example not found. Please create frontend/.env manually.
    )
)
cd ..

:: Start both servers
echo.
echo === Starting Servers ===
echo The Backend will start at http://localhost:8000
echo The Frontend will start at http://localhost:3000
echo.

:: Use start command to run them concurrently in new windows
start cmd /k "cd ML && venv\Scripts\activate.bat && python main.py"
start cmd /k "cd frontend && npm start"

echo Servers are starting in separate windows.
echo If they don't open automatically, visit the URLs mentioned above.
echo.
pause
