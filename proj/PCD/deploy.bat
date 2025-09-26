call rmdir /s /q dist
call rmdir /s /q ..\..\..\proj\PCD
call npm run build
xcopy /s /e /y dist\* ..\..\..\proj\PCD\
xcopy /s /e /y "dist\assets\DingTalk Sans-97169c5b.ttf" ..\..\..\assets\