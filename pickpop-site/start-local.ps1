param([int]$Port = 8080)

# Use a working Python 3 installation or the runtime already bundled with Codex.
$pickpopCandidates = @()
$pickpopPy = Get-Command py -ErrorAction SilentlyContinue
if ($pickpopPy) { $pickpopCandidates += @{ Path = $pickpopPy.Source; Prefix = @('-3') } }
$pickpopPython = Get-Command python -ErrorAction SilentlyContinue
if ($pickpopPython -and $pickpopPython.Source -notmatch 'Microsoft\\WindowsApps') {
    $pickpopCandidates += @{ Path = $pickpopPython.Source; Prefix = @() }
}
if (Get-Command Get-AppxPackage -ErrorAction SilentlyContinue) {
    Get-AppxPackage -Name '*CodexPrimaryRuntime*' | ForEach-Object {
        $pickpopBundled = Join-Path $_.InstallLocation 'dependencies\python\python.exe'
        if (Test-Path -LiteralPath $pickpopBundled) { $pickpopCandidates += @{ Path = $pickpopBundled; Prefix = @() } }
    }
}

foreach ($pickpopCandidate in $pickpopCandidates) {
    $pickpopVersion = & $pickpopCandidate.Path @($pickpopCandidate.Prefix) --version 2>&1
    if ($LASTEXITCODE -eq 0 -and "$pickpopVersion" -match 'Python (\d+)\.(\d+)' -and ([int]$Matches[1] -gt 3 -or ([int]$Matches[1] -eq 3 -and [int]$Matches[2] -ge 9))) {
        & $pickpopCandidate.Path @($pickpopCandidate.Prefix) (Join-Path $PSScriptRoot 'build.py')
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        & $pickpopCandidate.Path @($pickpopCandidate.Prefix) (Join-Path $PSScriptRoot 'serve.py') --port $Port
        exit $LASTEXITCODE
    }
}
Write-Host 'A working Python 3.9 or newer installation is required. See README.md for preview instructions.'
exit 1
