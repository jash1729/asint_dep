# =============================================================================
#  asint_dep - dependency-check workspace runner
# =============================================================================
#  Usage:
#    .\run.ps1 install      # one-time: install npm deps (root + asint_ais_cml)
#    .\run.ps1 build        # compile backend + run all tests
#    .\run.ps1 backend      # start Spring Boot backend on http://localhost:8080
#    .\run.ps1 cap          # start CAP / Node server on  http://localhost:4004
#    .\run.ps1 frontend     # build SAPUI5 app -> asint_ais_cml/dist
#    .\run.ps1 test         # backend mvn tests + jest tests + frontend build
#    .\run.ps1 stop         # kill all running java + node processes
#    .\run.ps1 probe        # curl health endpoints (servers must be running)
#
#  Prereqs (already installed on this machine):
#    - JDK 21 at  C:\Program Files\Java\jdk-21.0.11
#    - Node 24 / npm 11
# =============================================================================

param(
    [Parameter(Position = 0)]
    [ValidateSet('install', 'build', 'backend', 'cap', 'frontend', 'test', 'stop', 'probe')]
    [string]$Task = 'build'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

# ---- Environment ----------------------------------------------------------
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.11'
$env:Path = "$env:JAVA_HOME\bin;$Root\node_modules\.bin;$env:Path"

function Invoke-Step($Name, [scriptblock]$Block) {
    Write-Host "`n=== $Name ===" -ForegroundColor Cyan
    & $Block
    if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) {
        throw "Step '$Name' failed with exit code $LASTEXITCODE"
    }
}

switch ($Task) {

    'install' {
        Invoke-Step 'npm install (root)' {
            Push-Location $Root
            npm install --no-audit --no-fund
            Pop-Location
        }
        Invoke-Step 'npm install (asint_ais_cml)' {
            Push-Location "$Root\asint_ais_cml"
            npm install --no-audit --no-fund
            Pop-Location
        }
    }

    'build' {
        Invoke-Step 'mvn compile (backend)' {
            Push-Location "$Root\asint_ais_backend"
            ..\mvnw.cmd -Dcdsdk-global -DskipTests compile
            Pop-Location
        }
    }

    'backend' {
        Write-Host "Starting Spring Boot backend on http://localhost:8080 ..." -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
        Push-Location "$Root\asint_ais_backend"
        ..\mvnw.cmd -Dcdsdk-global -DskipTests spring-boot:run
        Pop-Location
    }

    'cap' {
        Write-Host "Starting CAP server on http://localhost:4004 ..." -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
        Push-Location $Root
        npm start
        Pop-Location
    }

    'frontend' {
        Invoke-Step 'ui5 build (asint_ais_cml)' {
            Push-Location "$Root\asint_ais_cml"
            npm run build
            Pop-Location
        }
    }

    'test' {
        Invoke-Step 'mvn test (backend, unit-tests profile)' {
            Push-Location "$Root\asint_ais_backend"
            ..\mvnw.cmd -Dcdsdk-global -P unit-tests test
            Pop-Location
        }
        Invoke-Step 'jest (root)' {
            Push-Location $Root
            npm test
            Pop-Location
        }
        Invoke-Step 'ui5 build (asint_ais_cml)' {
            Push-Location "$Root\asint_ais_cml"
            npm run build
            Pop-Location
        }
    }

    'stop' {
        Write-Host "Stopping all java + node processes (excluding VS Code extension host)..." -ForegroundColor Yellow
        Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        Get-Process java -ErrorAction SilentlyContinue |
            Where-Object { $_.Path -notlike '*\.vscode\extensions\*' } |
            Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "Done. Remaining java/node processes:" -ForegroundColor Green
        Get-Process java, node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path
    }

    'probe' {
        function Hit($url) {
            try {
                $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
                $body = if ($r.Content -is [byte[]]) { [Text.Encoding]::UTF8.GetString($r.Content) } else { $r.Content }
                "[{0}] {1}`n  {2}" -f $r.StatusCode, $url, ($body -replace "`n", ' ')
            } catch {
                "[ERR] {0} -> {1}" -f $url, $_.Exception.Message
            }
        }
        Write-Host "`n--- Backend (http://localhost:8080) ---" -ForegroundColor Cyan
        Hit 'http://localhost:8080/actuator/health'
        Hit 'http://localhost:8080/api/health'
        Hit 'http://localhost:8080/api/check/cds'
        Hit 'http://localhost:8080/api/check/mail'
        Hit 'http://localhost:8080/api/check/messaging'
        Write-Host "`n--- CAP server (http://localhost:4004) ---" -ForegroundColor Cyan
        Hit 'http://localhost:4004/'
        Hit 'http://localhost:4004/odata/v4/asset/$metadata'
    }
}

Write-Host "`nDone." -ForegroundColor Green
