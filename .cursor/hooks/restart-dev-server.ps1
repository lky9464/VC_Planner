# Agent/Tab 파일 편집 후 Next.js dev 서버를 재시작합니다.
$ErrorActionPreference = "SilentlyContinue"

$raw = [Console]::In.ReadToEnd()
$filePath = ""

if ($raw) {
    try {
        $input = $raw | ConvertFrom-Json
        if ($input.file_path) { $filePath = [string]$input.file_path }
        elseif ($input.path) { $filePath = [string]$input.path }
        elseif ($input.file) { $filePath = [string]$input.file }
    } catch {
        # JSON 파싱 실패 시에도 후속 재시작 로직을 시도합니다.
    }
}

$normalized = ($filePath -replace "\\", "/").TrimStart("./")

$watchPatterns = @(
    "^src/",
    "^public/",
    "next\.config\.ts$",
    "package\.json$",
    "postcss\.config\.mjs$",
    "tsconfig\.json$",
    "eslint\.config\.mjs$"
)

$shouldRestart = $false
if ($normalized) {
    foreach ($pattern in $watchPatterns) {
        if ($normalized -match $pattern) {
            $shouldRestart = $true
            break
        }
    }
} else {
    $shouldRestart = $true
}

if (-not $shouldRestart) {
    exit 0
}

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$debounceFile = Join-Path $projectRoot ".cursor/.dev-restart-ts"

if (Test-Path $debounceFile) {
    $lastText = Get-Content $debounceFile -Raw
    if ($lastText) {
        $last = [datetime]::Parse($lastText)
        if (((Get-Date) - $last).TotalSeconds -lt 3) {
            exit 0
        }
    }
}

(Get-Date).ToString("o") | Set-Content -Path $debounceFile -Encoding utf8NoBOM

$pids = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

foreach ($pid in $pids) {
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1

Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory $projectRoot -WindowStyle Hidden

exit 0
