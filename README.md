# Open-Source-Sticker-Micro-Business
An open source framework that helps anyone start their own sticker-printing micro-business.

## Contents
- [Open-Source-Sticker-Micro-Business](#open-source-sticker-micro-business)
	- [Contents](#contents)
	- [Project layout](#project-layout)
	- [What you need to install](#what-you-need-to-install)
	- [Running the application](#running-the-application)
	- [Everyday development](#everyday-development)
	- [Troubleshooting](#troubleshooting)
	- [Team standards](#team-standards)
	- [Acknowledgments](#acknowledgments)

## Project layout
The application has three parts. Each one runs in its own **Docker container**, a small isolated environment with exactly the software that part needs.

| Part | Folder | Technology | Address once running |
|---|---|---|---|
| Backend (server + business logic) | `sticker-business/` | Java 25, Spring Boot, Maven, Hibernate | http://localhost:8080 |
| Frontend (website users see) | `frontend/` | React, TypeScript, Vite | http://localhost:5173 |
| Database | (no folder; uses the official image) | MySQL 8.4 Community | only reachable by the backend |

`compose.yaml` (in the repo root) tells Docker how to start all three together.

## What you need to install
| Tool | Version | Why | Check it's installed |
|---|---|---|---|
| [Git](https://git-scm.com/downloads) | any recent | download the code | `git --version` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | any recent | builds and runs the containers | `docker compose version` |
| [Java JDK](https://adoptium.net/temurin/releases/?version=25) | **25** | only if you work on the backend (running tests, editor support) | `java -version` |
| [Node.js](https://nodejs.org/) | **24** | only if you work on the frontend outside Docker | `node -v` |

To just **run** the application, you only need Git and Docker. Docker downloads Java, Node.js and MySQL inside the containers for you.

You never need to install Maven. The project includes a Maven "wrapper" (`mvnw`) that downloads it for you.

## Running the application

> **Which terminal?** Some commands differ between terminals. Each step says which one to use:
> - **Git Bash / macOS / Linux**: Git Bash is installed with Git on Windows. macOS and Linux use their built-in Terminal.
> - **PowerShell**: the default terminal on Windows, and the default in VS Code on Windows.
>
> If a step shows only one command, it works the same in every terminal.

Do steps 1-3 once. After that, use only step 4.

**1. Get the code** (same in every terminal)
```bash
git clone https://github.com/RIT-Software-Engineering/Open-Source-Sticker-Micro-Business.git
cd Open-Source-Sticker-Micro-Business
```

**2. Create your `.env` file**

`.env` holds the database name and passwords. It is **never committed to git**, because it contains passwords. Make your own copy from the example:

Git Bash / macOS / Linux:
```bash
cp .env.example .env
```
PowerShell:
```powershell
Copy-Item .env.example .env
```
Open `.env` and replace both `replace-me` passwords with any passwords you like. They only exist on your computer.

**3. Start Docker Desktop**

Open the Docker Desktop app and wait until it says it is running.

**4. Build and start everything** (same in every terminal)
```bash
docker compose up --build
```
- `--build` rebuilds the images so they include your latest code. Docker compiles the backend for you inside a container.
- The **first** build takes several minutes while Docker downloads Java, Node.js, MySQL and all libraries. Later builds are much faster because Docker caches (reuses) those downloads.
- Wait until the logs stop scrolling. The database needs up to ~30 seconds to become healthy before the backend starts.
- Open http://localhost:8080. You should see **Hello Docker World**.
- Open http://localhost:5173. You should see the React starter page.

**To stop:** press `Ctrl+C`, then run `docker compose down`. Your database data is kept for next time.

## Everyday development
| I changed... | Do this |
|---|---|
| Frontend code (`frontend/`) | Run `docker compose up --build --watch` instead of step 4. Changes then appear automatically in the browser. |
| Backend code (`sticker-business/`) | Run `docker compose up --build backend` in a new terminal to rebuild and restart only the backend. |
| `.env` passwords | See "Access denied" under Troubleshooting. |

> **Tests do not run inside Docker.** The Docker build skips them to stay fast. Always run the `clean verify` command (below) before opening a pull request.

**Useful backend commands** (run inside `sticker-business/`):
| Git Bash / macOS / Linux | PowerShell | What it does |
|---|---|---|
| `./mvnw test` | `.\mvnw.cmd test` | Runs the tests. They use a temporary in-memory database (H2), so Docker is not needed. |
| `./mvnw spotless:apply` | `.\mvnw.cmd spotless:apply` | Auto-formats your Java code to the team style. Run it before committing. |
| `./mvnw clean verify` | `.\mvnw.cmd clean verify` | Full check: compiles, runs the tests and the format check. Look for `BUILD SUCCESS`. |

**Useful frontend commands** (run inside `frontend/`, needs Node.js):
| Command | What it does |
|---|---|
| `npm install` | Downloads dependencies (first time only). |
| `npm run dev` | Runs the frontend without Docker at http://localhost:5173. |
| `npm run lint` | Checks the code for common mistakes. |

**VS Code:** the repo includes shared team settings in `.vscode/settings.json`. When you open the project, VS Code will offer to install the team's recommended extensions (listed in `.vscode/extensions.json`). Click **Install**. You can also find them later under Extensions → filter "Recommended".

**Line endings:** the repo's root `.gitattributes` file converts checked out files to your operating system's native ending when you check out.

## Troubleshooting
| Problem | Cause and fix |
|---|---|
| `$'\r': command not found` during the Docker build | `mvnw` on your computer has Windows (CRLF) line endings. From the repo root, delete it and let git restore it with LF: `rm sticker-business/mvnw && git checkout -- sticker-business/mvnw` (Git Bash/macOS/Linux) or `Remove-Item sticker-business\mvnw; git checkout -- sticker-business/mvnw` (PowerShell). Then rebuild. |
| `env file ... .env not found` | You skipped step 2. Create `.env`. |
| `Cannot connect to the Docker daemon` | Docker Desktop isn't running. Start it (step 3). |
| `The following files had format violations` | Your Java code isn't in team format. Run `./mvnw spotless:apply` (Git Bash/macOS/Linux) or `.\mvnw.cmd spotless:apply` (Windows), then build again. |
| `port is already allocated` | Another program is using port 8080 or 5173. Close it, or stop old containers with `docker compose down`. |
| Backend log says `Access denied for user` | You changed passwords in `.env` after the database was first created. MySQL keeps the original ones. Reset with `docker compose down -v`. **This deletes all local database data.** |
| `java -version` doesn't show 25 | Install JDK 25 and make sure your `JAVA_HOME` environment variable points to it. |

## Team standards
- [Git standards](documentation/git_standards.md): branches, commits and pull requests
- [Java standards](documentation/java_standards.md): code style and null safety

## Acknowledgments
This README was written by Claude Opus 5.5, a large language model made by Anthropic.

Anthropic. (2026). *Claude Opus 5.5* (claude-opus-5-5) [Large language model]. https://www.anthropic.com/claude
