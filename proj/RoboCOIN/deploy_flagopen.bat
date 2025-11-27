call rmdir /s /q dist
call npm run build
call cd dist
call git init
call git add .
call git commit -m "deploy"
call git branch -M home_wsh
call git remote add origin https://github.com/FlagOpen/RoboCOIN.git
call git push -u origin home_wsh --force