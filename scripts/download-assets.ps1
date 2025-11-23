param(
    [string]$splashUrl = 'https://oragreenwater.com/wp-content/uploads/2024/08/White-Logo.png',
    [string]$outDir = 'assets',
    [string]$outFile = 'splash.png'
)

if (-not (Test-Path -Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$outPath = Join-Path -Path $outDir -ChildPath $outFile

Write-Host "Downloading splash image from: $splashUrl"
Write-Host "Destination: $outPath"

try {
    Invoke-WebRequest -Uri $splashUrl -OutFile $outPath -UseBasicParsing
    Write-Host "Downloaded splash image successfully."
} catch {
    Write-Error "Failed to download splash image: $_"
}

if (Test-Path -Path $outPath) {
    $fileInfo = Get-Item $outPath
    Write-Host "File size: $($fileInfo.Length) bytes"
} else {
    Write-Error "No file found at $outPath"
}

Write-Host "Done."
