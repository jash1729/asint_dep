# asint_dep — Run Commands

Reference of every command needed to install, build, run, test, and stop this dependency-check workspace on Windows / PowerShell.

> **Prereqs (already installed on this machine):**
> - JDK 21 at `C:\Program Files\Java\jdk-21.0.11`
> - Node 24 / npm 11
> - Maven wrapper (`mvnw.cmd`) ships with the repo

---

## 0. One-time environment setup (every fresh shell)

Set `JAVA_HOME` and put the locally-installed `cds` CLI on `PATH` so the Maven `cds-maven-plugin` reuses it instead of trying to download its own:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.11'
$env:Path = "$env:JAVA_HOME\bin;$PWD\node_modules\.bin;$env:Path"
```

> Always pass `-Dcdsdk-global` to any `mvnw` invocation so the plugin uses the CLI on `PATH`.

---

## 1. Install dependencies (run once after clone)

```powershell
# Workspace root — installs CAP/Node deps used by srv/server.js
npm install --no-audit --no-fund

# Frontend (SAPUI5 app)
cd asint_ais_cml
npm install --no-audit --no-fund
cd ..
```

---

## 2. Build / compile

### Backend (Spring Boot, Java 21)

```powershell
cd asint_ais_backend
..\mvnw.cmd -Dcdsdk-global -DskipTests compile
cd ..
```

### Frontend (UI5 build → `asint_ais_cml/dist`)

```powershell
cd asint_ais_cml
npm run build
cd ..
```

---

## 3. Run tests (verifies every declared dependency loads)

### Backend Maven tests (`unit-tests` profile, runs the `fast`-tagged tests)

```powershell
cd asint_ais_backend
..\mvnw.cmd -Dcdsdk-global -P unit-tests test
cd ..
```

Expected: `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0` — `BUILD SUCCESS`.

### Node / Jest tests (loads every npm runtime dep)

```powershell
npm test
```

Expected: `Tests: 7 passed, 7 total`.

### Frontend build smoke-test

```powershell
cd asint_ais_cml
npm run build
cd ..
```

Expected: `Build succeeded in <n> s`.

---

## 4. Run the application

Open **two terminals** (one per server). Each runs in the foreground; press `Ctrl+C` to stop.

### Terminal A — Spring Boot backend → http://localhost:8080

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.11'
$env:Path = "$env:JAVA_HOME\bin;$PWD\node_modules\.bin;$env:Path"
cd asint_ais_backend
..\mvnw.cmd -Dcdsdk-global -DskipTests spring-boot:run
```

### Terminal B — CAP / Node server → http://localhost:4004

```powershell
$env:Path = "$PWD\node_modules\.bin;$env:Path"
npm start
```

---

## 5. Probe the running services

Open a third terminal:

```powershell
# Backend
Invoke-WebRequest http://localhost:8080/actuator/health    -UseBasicParsing
Invoke-WebRequest http://localhost:8080/api/health         -UseBasicParsing
Invoke-WebRequest http://localhost:8080/api/check/cds      -UseBasicParsing
Invoke-WebRequest http://localhost:8080/api/check/mail     -UseBasicParsing
Invoke-WebRequest http://localhost:8080/api/check/messaging -UseBasicParsing

# CAP server
Invoke-WebRequest http://localhost:4004/                              -UseBasicParsing
Invoke-WebRequest 'http://localhost:4004/odata/v4/asset/$metadata'    -UseBasicParsing
```

Endpoint reference:

| URL | Purpose |
|---|---|
| `GET /actuator/health` | Spring Boot Actuator |
| `GET /api/health` | Custom `HealthController` |
| `GET /api/check/cds` | CAP runtime + Cloud SDK |
| `GET /api/check/utility` | POI, xlsx-streamer, PDFBox, JavaFX, Olingo, Jackson XML, httpmime, Nashorn, Bucket4j, `@Cacheable` (requires Redis on `localhost:6379` to return 200) |
| `GET /api/check/mail` | Spring `JavaMailSender` |
| `GET /api/check/messaging` | Jedis pool + WebFlux `WebClient` |
| `GET /odata/v4/asset/$metadata` | CAP `AssetService` OData metadata |

---

## 6. Stop the servers

```powershell
# Stop everything except the VS Code Java language-server
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process java -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -notlike '*\.vscode\extensions\*' } |
    Stop-Process -Force -ErrorAction SilentlyContinue
```

---

## 7. Shortcut — wrapper script

The repo also provides [run.ps1](run.ps1) / [run.cmd](run.cmd) which wrap all of the above:

```powershell
.\run.ps1 install     # npm install in root + asint_ais_cml
.\run.ps1 build       # mvn compile (backend)
.\run.ps1 test        # mvn unit-tests + jest + ui5 build
.\run.ps1 backend     # start Spring Boot on :8080  (Ctrl+C to stop)
.\run.ps1 cap         # start CAP server  on :4004  (Ctrl+C to stop)
.\run.ps1 frontend    # ui5 build -> asint_ais_cml/dist
.\run.ps1 probe       # curl the health endpoints listed above
.\run.ps1 stop        # kill all running java + node processes
```
