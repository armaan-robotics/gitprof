@echo off
echo Starting GitProf at http://localhost:8000
echo Press Ctrl+C to stop the server.
cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000
