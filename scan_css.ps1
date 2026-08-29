$lines = Get-Content 'd:\Source code\NexusOSProject\NexusOST\css\style.css'
Write-Output "=== [data-theme] blocks ==="
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'data-theme.*\{') {
        Write-Output ('{0}: {1}' -f ($i+1), $lines[$i].Trim())
    }
}

Write-Output ""
Write-Output "=== Duplicate selectors ==="
$selectorMap = @{}
for ($i=0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    if ($line -match '^[\.#\[\*:a-zA-Z].*\{$' -and $line -notmatch '@' -and $line -notmatch '\}') {
        $selector = $line -replace '\s*\{$', ''
        if ($selectorMap.ContainsKey($selector)) {
            $selectorMap[$selector] += ",($i+1)"
        } else {
            $selectorMap[$selector] = "($i+1)"
        }
    }
}
foreach ($key in $selectorMap.Keys) {
    $val = $selectorMap[$key]
    if ($val -match ',') {
        Write-Output "$key => lines: $val"
    }
}
