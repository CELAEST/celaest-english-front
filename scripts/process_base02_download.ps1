# Script to automatically pick up the newest Speechify Studio MP3 download and slice for Base 02
$downloadDir = "C:\Users\user\Downloads"
$newestMp3 = Get-ChildItem -Path $downloadDir -Filter "*.mp3" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $newestMp3) {
    Write-Error "No MP3 found in Downloads."
    exit 1
}

Write-Host "Found newest download: $($newestMp3.FullName) ($($newestMp3.Length) bytes, $($newestMp3.LastWriteTime))"

$src = $newestMp3.FullName
$destDir = "public/audio/pathway/a1/base_02"
$backupDir = "public/audio/pathway/a1/base_02_backup"

if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force }
if (-not (Test-Path $backupDir) -and (Test-Path $destDir)) { Copy-Item $destDir $backupDir -Recurse }

# Copy master file
Copy-Item $src "public/audio/walter_base02_studio.mp3" -Force

# Auto detect silence points or slice with detected timestamps
Write-Host "Detecting silence points with ffmpeg..."
$silenceOutput = & ffmpeg -i $src -af "silencedetect=noise=-32dB:d=0.5" -f null - 2>&1 | Select-String "silence_start|silence_end"
$silenceOutput | Select-Object -First 15 | ForEach-Object { Write-Host $_ }

