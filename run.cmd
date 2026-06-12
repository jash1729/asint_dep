@echo off
REM ===========================================================================
REM  asint_dep - dependency-check workspace runner (cmd shim for run.ps1)
REM
REM  Usage:
REM    run.cmd install
REM    run.cmd build
REM    run.cmd backend     (starts Spring Boot on http://localhost:8080)
REM    run.cmd cap         (starts CAP server   on http://localhost:4004)
REM    run.cmd frontend
REM    run.cmd test
REM    run.cmd stop
REM    run.cmd probe
REM ===========================================================================
setlocal
set TASK=%1
if "%TASK%"=="" set TASK=build
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run.ps1" -Task %TASK%
endlocal
