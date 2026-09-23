@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo OPORD — briefing confidencial para clãs de milsim
echo ------------------------------------------------------------
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao encontrado.
  echo Instale a versao 22 LTS em https://nodejs.org/  e tente de novo.
  echo.
  pause
  exit /b 1
)

node scripts\abrir.mjs
if errorlevel 1 (
  echo.
  pause
  exit /b 1
)
