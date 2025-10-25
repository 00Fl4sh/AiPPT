@echo off
REM Navigate to client directory
cd client

REM Install dependencies
call npm install

REM Build the React app
call npm run build

REM The build output will be in client/build
echo Build completed successfully!
