@echo off
echo Converting images to WebP format...
echo.

REM Create WebP directory if it doesn't exist
if not exist "static\images\webp" mkdir "static\images\webp"

REM Convert JPG files
echo Converting JPG files...
for %%f in (static\images\*.jpg) do (
    echo Converting %%~nf.jpg...
    cwebp "%%f" -q 85 -o "static\images\webp\%%~nf.webp"
)

REM Convert PNG files (excluding favicons and logos)
echo Converting PNG files...
for %%f in (static\images\*.png) do (
    echo Converting %%~nf.png...
    cwebp "%%f" -q 85 -o "static\images\webp\%%~nf.webp"
)

REM Convert images in subdirectories
echo Converting images in subdirectories...
for %%f in (static\images\icons\*.png) do (
    echo Converting icons\%%~nf.png...
    cwebp "%%f" -q 85 -o "static\images\webp\%%~nf.webp"
)

echo.
echo WebP conversion completed!
echo WebP files saved in: static\images\webp\
echo.
pause

