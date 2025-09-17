# PowerShell script to convert images to WebP
Write-Host "Converting images to WebP format..." -ForegroundColor Green

# Create WebP directory if it doesn't exist
$webpDir = "static\images\webp"
if (!(Test-Path $webpDir)) {
    New-Item -ItemType Directory -Path $webpDir -Force
    Write-Host "Created WebP directory: $webpDir" -ForegroundColor Yellow
}

# Function to convert image to WebP
function Convert-ToWebP {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality = 85
    )
    
    if (Test-Path $InputPath) {
        Write-Host "Converting: $(Split-Path $InputPath -Leaf)" -ForegroundColor Cyan
        & cwebp $InputPath -q $Quality -o $OutputPath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Success: $(Split-Path $OutputPath -Leaf)" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed: $(Split-Path $InputPath -Leaf)" -ForegroundColor Red
        }
    }
}

# Convert JPG files
Write-Host "`nConverting JPG files..." -ForegroundColor Yellow
Get-ChildItem -Path "static\images\*.jpg" | ForEach-Object {
    $outputPath = Join-Path $webpDir "$($_.BaseName).webp"
    Convert-ToWebP -InputPath $_.FullName -OutputPath $outputPath
}

# Convert PNG files (excluding favicons and logos)
Write-Host "`nConverting PNG files..." -ForegroundColor Yellow
Get-ChildItem -Path "static\images\*.png" | Where-Object { 
    $_.Name -notlike "*favicon*" -and 
    $_.Name -notlike "*logo*" -and 
    $_.Name -notlike "*icon*" 
} | ForEach-Object {
    $outputPath = Join-Path $webpDir "$($_.BaseName).webp"
    Convert-ToWebP -InputPath $_.FullName -OutputPath $outputPath
}

# Convert icons (with lower quality for smaller file size)
Write-Host "`nConverting icon files..." -ForegroundColor Yellow
Get-ChildItem -Path "static\images\icons\*.png" | ForEach-Object {
    $outputPath = Join-Path $webpDir "$($_.BaseName).webp"
    Convert-ToWebP -InputPath $_.FullName -OutputPath $outputPath -Quality 75
}

Write-Host "`nWebP conversion completed!" -ForegroundColor Green
Write-Host "WebP files saved in: $webpDir" -ForegroundColor Yellow

# Show file size comparison
Write-Host "`nFile size comparison:" -ForegroundColor Cyan
$originalSize = (Get-ChildItem -Path "static\images\*.jpg", "static\images\*.png" | Measure-Object -Property Length -Sum).Sum
$webpSize = (Get-ChildItem -Path "$webpDir\*.webp" | Measure-Object -Property Length -Sum).Sum
$savings = [math]::Round((($originalSize - $webpSize) / $originalSize) * 100, 2)

Write-Host "Original size: $([math]::Round($originalSize / 1MB, 2)) MB" -ForegroundColor White
Write-Host "WebP size: $([math]::Round($webpSize / 1MB, 2)) MB" -ForegroundColor White
Write-Host "Space saved: $savings%" -ForegroundColor Green

Read-Host "`nPress Enter to continue..."

