# Script de sauvegarde automatique et horodatée des fichiers du projet
param (
    [string]$BackupDir = "backups",
    [int]$MaxBackups = 15
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$TargetFolder = Join-Path $ProjectRoot (Join-Path $BackupDir "snapshot_$Timestamp")

Write-Host "Protection des fichiers : création d'un instantané de sauvegarde..." -ForegroundColor Cyan

# Création du dossier cible
if (-not (Test-Path $TargetFolder)) {
    New-Item -ItemType Directory -Path $TargetFolder -Force | Out-Null
}

# Fichiers et dossiers à sauvegarder
$ItemsToBackup = @("index.html", "style.css", "script.js", "assets", "GEMINI.md", "AGENTS.md")

foreach ($item in $ItemsToBackup) {
    $SourcePath = Join-Path $ProjectRoot $item
    if (Test-Path $SourcePath) {
        Copy-Item -Path $SourcePath -Destination $TargetFolder -Recurse -Force
        Write-Host "  [OK] Sauvegardé : $item" -ForegroundColor Green
    }
}

Write-Host "`nSauvegarde réussie dans : $TargetFolder" -ForegroundColor Cyan

# Nettoyage automatique des anciennes sauvegardes au-delà du seuil
$AllBackups = Get-ChildItem -Path (Join-Path $ProjectRoot $BackupDir) -Directory | Sort-Object CreationTime -Descending
if ($AllBackups.Count -gt $MaxBackups) {
    $ToPurge = $AllBackups | Select-Object -Skip $MaxBackups
    foreach ($old in $ToPurge) {
        Remove-Item -Path $old.FullName -Recurse -Force
        Write-Host "  [CLEANUP] Ancienne sauvegarde purgée : $($old.Name)" -ForegroundColor DarkGray
    }
}
