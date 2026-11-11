$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$demoNode = (Get-Command node -ErrorAction Stop).Source
if (-not (Test-Path -LiteralPath 'node_modules/tsx/dist/cli.mjs')) {
    $demoNpm = Join-Path (Split-Path -Parent $demoNode) 'node_modules/npm/bin/npm-cli.js'
    if (-not (Test-Path -LiteralPath $demoNpm)) { throw 'Az npm nem található a Node.js mellett. Telepítsd a függőségeket: npm install' }
    & $demoNode $demoNpm install
    if ($LASTEXITCODE -ne 0) { throw 'A függőségek telepítése sikertelen.' }
}
& $demoNode 'node_modules/tsx/dist/cli.mjs' 'server/index.ts'
