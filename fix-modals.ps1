# PowerShell script to fix JSX formatting issues in modal files
$files = Get-ChildItem -Path "src\components\Modals\*.tsx"

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    $content = Get-Content $file.FullName -Raw
    
    # Fix the specific pattern that's causing issues
    # Look for div elements with very long className that include role and onClick attributes
    $pattern = '(\s+)<div className="([^"]*)" role="dialog" aria-modal="true" onClick=\{([^}]+)\}>'
    
    $replacement = {
        param($match)
        $indent = $match.Groups[1].Value
        $className = $match.Groups[2].Value
        $onClick = $match.Groups[3].Value
        
        return "$indent<div`n$indent  className=`"$className`"`n$indent  role=`"dialog`"`n$indent  aria-modal=`"true`"`n$indent  onClick={$onClick}`n$indent>"
    }
    
    $newContent = [regex]::Replace($content, $pattern, $replacement)
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Fixed: $($file.Name)"
    } else {
        Write-Host "No changes needed: $($file.Name)"
    }
}

Write-Host "Processing complete!"
