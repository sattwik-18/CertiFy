# Start Certify Application Locally
# This script starts both backend and frontend servers

Write-Host "🚀 Starting Certify Application..." -ForegroundColor Cyan
Write-Host ""

# Get current directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptPath) {
    $scriptPath = Get-Location
}

# Check if .env files exist
if (-not (Test-Path "$scriptPath\server\.env")) {
    Write-Host "❌ server/.env not found. Please create it first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$scriptPath\.env.local")) {
    Write-Host "⚠️  .env.local not found. Creating it..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:5000/api`nVITE_FRONTEND_URL=http://localhost:3000" | Out-File -FilePath "$scriptPath\.env.local" -Encoding utf8
}

# Start backend server
Write-Host "📡 Starting backend server (port 5000)..." -ForegroundColor Green
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\server'; npm run dev" -PassThru -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "🌐 Starting frontend server (port 3000)..." -ForegroundColor Green
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; npm run dev" -PassThru -WindowStyle Normal

Write-Host ""
Write-Host "✅ Servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C or close the PowerShell windows to stop the servers." -ForegroundColor Yellow
Write-Host ""

# Wait for user to stop
Write-Host "Servers are running in separate windows. Press any key to exit this script (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

