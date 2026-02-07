@echo off
cd /d "%~dp0"

echo ===== Git status =====
git status

echo.
echo ===== Add all changes =====
git add .

echo.
set /p msg=Commit message (leave blank for "update site"): 
if "%msg%"=="" set msg=update site

echo.
echo ===== Commit =====
git commit -m "%msg%"

echo.
echo ===== Push =====
git push

echo.
echo Done! If you see "nothing to commit", it means no changes.
pause
