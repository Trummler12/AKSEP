# Backend starten
Write-Host "Starte Backend..." -ForegroundColor Cyan
$backend = Start-Process `
    -FilePath "backend\gradlew.bat" `
    -ArgumentList "run" `
    -WorkingDirectory "backend" `
    -NoNewWindow -PassThru

# Frontend starten (sobald dort ein Dev-Server existiert, z.B. npm run dev)
Write-Host "Starte Frontend..." -ForegroundColor Cyan
$frontend = Start-Process `
    -FilePath "npm" `
    -ArgumentList "run dev" `
    -WorkingDirectory "frontend" `
    -NoNewWindow -PassThru

Write-Host "Backend PID: $($backend.Id), Frontend PID: $($frontend.Id)" -ForegroundColor Green
Write-Host "Zum Beenden: Prozesse im Task-Manager schließen oder PowerShell-Fenster beenden." -ForegroundColor Yellow

Wait-Process $backend $frontend
