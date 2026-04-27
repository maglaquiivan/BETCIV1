# Script to check for label accessibility issues

Write-Host "Checking for label accessibility issues..." -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path "BETCIV1-main/frontend" -Filter "*.html" -Recurse

$issuesFound = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Extract all label 'for' attributes
    $labelFors = [regex]::Matches($content, '<label[^>]+for="([^"]+)"')
    
    # Extract all element IDs
    $elementIds = [regex]::Matches($content, '\sid="([^"]+)"')
    
    $idList = @{}
    foreach ($match in $elementIds) {
        $id = $match.Groups[1].Value
        $idList[$id] = $true
    }
    
    # Check each label 'for' attribute
    foreach ($match in $labelFors) {
        $forValue = $match.Groups[1].Value
        if (-not $idList.ContainsKey($forValue)) {
            Write-Host "❌ ISSUE in $($file.Name):" -ForegroundColor Red
            Write-Host "   Label for='$forValue' but no element with id='$forValue'" -ForegroundColor Yellow
            $issuesFound++
        }
    }
    
    # Check for labels without 'for' attribute (excluding those wrapping inputs)
    $labelsWithoutFor = [regex]::Matches($content, '<label(?![^>]*for=)[^>]*>(?![\s\n]*<input)')
    foreach ($match in $labelsWithoutFor) {
        $labelText = $match.Value
        if ($labelText -notmatch 'class="permission-checkbox"' -and $labelText -notmatch '<label[^>]*>\s*<input') {
            Write-Host "⚠️  WARNING in $($file.Name):" -ForegroundColor Yellow
            Write-Host "   Label without 'for' attribute: $($labelText.Substring(0, [Math]::Min(50, $labelText.Length)))..." -ForegroundColor Gray
            $issuesFound++
        }
    }
}

Write-Host ""
if ($issuesFound -eq 0) {
    Write-Host "✅ No label accessibility issues found!" -ForegroundColor Green
} else {
    Write-Host "Found $issuesFound potential issues" -ForegroundColor Red
}
