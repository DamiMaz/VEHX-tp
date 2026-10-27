$baseDir = "E:\Repositorio 2026\Trabajo Final de Programacion"
$outDir = "C:\Users\damia\.gemini\antigravity\brain\ab15ca5b-328c-4ee4-8e25-34b50c0cc135\screenshots"
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$distHtml = "file:///E:/Repositorio%202026/Trabajo%20Final%20de%20Programacion/frontend/dist/index.html"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$shots = @(
    @{ Name = "web_view_home_centered.png"; Tab = "home"; W = 1280; H = 900 },
    @{ Name = "web_view_garage_2cols.png"; Tab = "garage"; W = 1280; H = 900 },
    @{ Name = "web_view_fuel_uniform_button.png"; Tab = "fuel"; W = 1280; H = 900 },
    @{ Name = "web_view_services_uniform.png"; Tab = "services"; W = 1280; H = 900 },
    @{ Name = "web_view_telemetry_uniform.png"; Tab = "telemetry"; W = 1280; H = 900 },
    @{ Name = "mobile_home_header.png"; Tab = "home"; W = 430; H = 932 },
    @{ Name = "mobile_garage_cards.png"; Tab = "garage"; W = 430; H = 932 },
    @{ Name = "mobile_fuel_actions.png"; Tab = "fuel"; W = 430; H = 932 }
)

foreach ($s in $shots) {
    $outFile = Join-Path $outDir $s.Name
    $url = "$distHtml#$($s.Tab)"
    $tmpDir = Join-Path $env:TEMP "c_shot_$(Get-Random)"
    Write-Host "Capturing $($s.Name)..."
    & $chrome --headless=new --user-data-dir="$tmpDir" --allow-file-access-from-files --no-sandbox --disable-gpu "--window-size=$($s.W),$($s.H)" "--screenshot=$outFile" "$url"
    Start-Sleep -Seconds 1
    if (Test-Path $outFile) {
        $len = (Get-Item $outFile).Length
        Write-Host "OK: $($s.Name) ($len bytes)"
    } else {
        Write-Warning "FAILED: $($s.Name)"
    }
    Remove-Item -Recurse -Force $tmpDir -ErrorAction SilentlyContinue
}

Write-Host "All visual test captures completed!"
