#!/usr/bin/env pwsh

# Script to add useEscapeKey hook calls to modals that have the import but not the call
$modalDir = "src/components/Modals"
$modalFiles = Get-ChildItem "$modalDir/*.tsx"

Write-Host "Adding useEscapeKey hook calls to modal files..."

foreach ($file in $modalFiles) {
    $fileName = $file.Name
    $content = Get-Content $file.FullName -Raw
    
    # Skip if doesn't have useEscapeKey import
    if (-not ($content -match "useEscapeKey")) {
        continue
    }
    
    # Skip if already has useEscapeKey call
    if ($content -match "useEscapeKey\(") {
        Write-Host "✓ $fileName already has useEscapeKey call"
        continue
    }
    
    Write-Host "Adding useEscapeKey call to $fileName..."
    
    # Find the pattern where component starts and add useEscapeKey hook call
    $content = $content -replace 
        "(\s+const\s+\w+\s*=\s*useDataStore\(\);)", 
        "`$1`n`n  useEscapeKey(isOpen, onClose);"
    
    # Alternative pattern if useDataStore is not found
    if (-not ($content -match "useEscapeKey\(")) {
        $content = $content -replace 
            "(\s+const\s+.*\s*=\s*useState\()", 
            "`n  useEscapeKey(isOpen, onClose);`n`n`$1"
    }
    
    Set-Content $file.FullName -Value $content
    Write-Host "✓ Added useEscapeKey call to $fileName"
}

Write-Host "`nAll useEscapeKey hook calls added!"
