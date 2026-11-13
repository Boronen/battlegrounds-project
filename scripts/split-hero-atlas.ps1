param(
 [Parameter(Mandatory=$true)][string]$AtlasPath,
 [Parameter(Mandatory=$true)][int]$FirstHero,
 [int]$Columns=3,
 [int]$Rows=2
)

# Split generated portrait sheets without changing or repainting the artwork.
Add-Type -AssemblyName System.Drawing
$outputDirectory = Join-Path $PSScriptRoot '../public/portraits/sketch'
New-Item -ItemType Directory -Force $outputDirectory | Out-Null
$manifestPath = Join-Path $outputDirectory 'manifest.json'
$standalonePortraits = @()
if (Test-Path -LiteralPath $manifestPath) {
 foreach ($group in (Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json)) {
  if ($group.overrides) { $standalonePortraits += $group.overrides.PSObject.Properties.Name }
 }
}
$atlas = [System.Drawing.Bitmap]::new((Resolve-Path -LiteralPath $AtlasPath).Path)
try {
 for ($index=0; $index -lt $Columns*$Rows; $index++) {
  $portraitName = ($FirstHero+$index).ToString()+'.png'
  if ($standalonePortraits -contains $portraitName) {
   Write-Output "Preserving standalone portrait $portraitName"
   continue
  }
  $left = [int][Math]::Floor(($index % $Columns)*$atlas.Width/$Columns)
  $top = [int][Math]::Floor([Math]::Floor($index/$Columns)*$atlas.Height/$Rows)
  $right = [int][Math]::Floor((($index % $Columns)+1)*$atlas.Width/$Columns)
  $bottom = [int][Math]::Floor(([Math]::Floor($index/$Columns)+1)*$atlas.Height/$Rows)
  $rectangle = [System.Drawing.Rectangle]::new($left,$top,$right-$left,$bottom-$top)
  $cell = $atlas.Clone($rectangle,$atlas.PixelFormat)
  try {
   $cell.Save((Join-Path $outputDirectory $portraitName),[System.Drawing.Imaging.ImageFormat]::Png)
  } finally { $cell.Dispose() }
 }
} finally { $atlas.Dispose() }
