#!/usr/bin/env pwsh

# Script to update all modal files with useEscapeKey hook
$modalDir = "src/components/Modals"
$modalFiles = Get-ChildItem "$modalDir/*.tsx"

Write-Host "Found $($modalFiles.Count) modal files to update..."

foreach ($file in $modalFiles) {
    $fileName = $file.Name
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already has useEscapeKey
    if ($content -match "useEscapeKey") {
        Write-Host "✓ $fileName already has useEscapeKey"
        continue
    }
    
    Write-Host "Updating $fileName..."
    
    # Add useEscapeKey import
    $content = $content -replace 
        "(import.*from '../../store/dataStore';)", 
        "`$1`nimport { useEscapeKey } from '../../hooks/useEscapeKey';"
    
    # Add useEscapeKey hook call after component start
    $content = $content -replace 
        "(const \w+Modal.*= \({ isOpen, onClose.*\}) => \{[\s\n]*)", 
        "`$1  useEscapeKey(isOpen, onClose);`n`n  "
    
    # Update modal container with ARIA attributes
    $content = $content -replace 
        '<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">', 
        '<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>'
    
    $content = $content -replace 
        '<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl', 
        '<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}'
    
    Set-Content $file.FullName -Value $content
    Write-Host "✓ Updated $fileName"
}

Write-Host "`nAll modal files updated successfully!"
