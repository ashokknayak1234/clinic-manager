#!/usr/bin/env python3
"""
OpenClinic Development Server Launcher
Starts both backend (FastAPI) and frontend (Next.js) servers.

Run with any Python:  python scripts/dev.py
The backend is started with the first interpreter that has backend/requirements.txt
installed (the plain `python` on this machine is 3.12 without uvicorn).
"""
import atexit
import os
import shutil
import signal
import subprocess
import sys
import time
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_DIR / "backend"
FRONTEND_DIR = PROJECT_DIR / "frontend"
LOG_DIR = PROJECT_DIR / ".freebuff" / "dev-logs"

REQUIRED_MODULES = (
    "fastapi",
    "uvicorn",
    "pymysql",
    "jwt",
    "bcrypt",
    "dotenv",
    "pydantic_settings",
)

processes = []


def cleanup():
    """Terminate all child processes (and their children) on exit."""
    for p in reversed(processes):
        if p.poll() is not None:
            continue
        print(f"\nStopping server process {p.pid} ...")
        if os.name == "nt":
            # npm spawns node.exe as a grandchild; taskkill /T takes the whole tree.
            subprocess.run(
                ["taskkill", "/PID", str(p.pid), "/T", "/F"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
        else:
            p.terminate()
        try:
            p.wait(timeout=5)
        except subprocess.TimeoutExpired:
            p.kill()
            p.wait(timeout=5)


atexit.register(cleanup)


def signal_handler(sig, frame):
    print("\nShutting down...")
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)


def check_dirs():
    """Verify required directories exist."""
    if not BACKEND_DIR.exists():
        print(f"ERROR: Backend directory not found: {BACKEND_DIR}")
        return False
    if not FRONTEND_DIR.exists():
        print(f"ERROR: Frontend directory not found: {FRONTEND_DIR}")
        return False
    return True


def port_in_use(port: int) -> bool:
    import socket

    with socket.socket() as sock:
        sock.settimeout(0.5)
        return sock.connect_ex(("127.0.0.1", port)) == 0


def python_has_dependencies(command: list[str]) -> bool:
    probe = "import " + ", ".join(REQUIRED_MODULES)
    try:
        result = subprocess.run(
            [*command, "-c", probe],
            cwd=BACKEND_DIR,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=15,
            check=False,
        )
        return result.returncode == 0
    except (OSError, subprocess.SubprocessError):
        return False


def resolve_python() -> list[str]:
    """Find an interpreter that can actually import the backend dependencies."""
    candidates: list[list[str]] = []

    def add(command: list[str]) -> None:
        if command and command not in candidates:
            candidates.append(command)

    add([sys.executable])

    launcher = shutil.which("py")
    if launcher:
        for version in ("3.14", "3.13", "3.12", "3.11", "3.10"):
            add([launcher, f"-{version}"])

    for name in (
        "python3.14",
        "python3.13",
        "python3.12",
        "python3.11",
        "python3",
        "python",
    ):
        path = shutil.which(name)
        if path:
            add([path])

    for command in candidates:
        if python_has_dependencies(command):
            return command

    raise RuntimeError(
        "No Python interpreter with the backend dependencies was found.\n"
        f"Install them into the Python you use, e.g.:\n"
        f'  "{sys.executable}" -m pip install -r "{BACKEND_DIR / "requirements.txt"}"'
    )


def open_log(name: str):
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    return open(LOG_DIR / name, "w", encoding="utf-8")


def tail_log(name: str, lines: int = 25) -> None:
    path = LOG_DIR / name
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8", errors="replace").splitlines()
    print(f"--- last {min(lines, len(text))} lines of {path.name} ---")
    for line in text[-lines:]:
        print(line)
    print("--- end of log ---")


def start_backend(python_command: list[str]):
    """Start FastAPI backend on port 8000."""
    print(f"Starting backend on http://127.0.0.1:8000 with {' '.join(python_command)} ...")
    cmd = [
        *python_command,
        "-m",
        "uvicorn",
        "app.main:app",
        "--port",
        "8000",
        "--host",
        "0.0.0.0",
    ]
    with open_log("backend.log") as log:
        p = subprocess.Popen(cmd, cwd=BACKEND_DIR, stdout=log, stderr=subprocess.STDOUT)
    processes.append(p)
    return p


def start_frontend():
    """Start the Next.js frontend on port 3000."""
    print("Starting frontend on http://localhost:3000 ...")
    npm = shutil.which("npm.cmd") or shutil.which("npm") or "npm"
    cmd = [npm, "run", "dev"]
    with open_log("frontend.log") as log:
        p = subprocess.Popen(
            cmd,
            cwd=FRONTEND_DIR,
            shell=os.name == "nt",
            stdout=log,
            stderr=subprocess.STDOUT,
        )
    processes.append(p)
    return p


def wait_for_backend(max_wait: int = 30) -> bool:
    """Wait for backend health endpoint to respond."""
    from urllib.error import URLError
    from urllib.request import urlopen

    url = "http://127.0.0.1:8000/api/v1/health"
    for i in range(max_wait):
        try:
            with urlopen(url, timeout=2) as response:
                if response.status == 200:
                    print("Backend is ready!")
                    return True
        except (OSError, URLError):
            pass
        time.sleep(1)
        if i % 5 == 0:
            print(f"  Waiting for backend... ({i}/{max_wait}s)")
    return False


def main():
    print("=" * 60)
    print("OpenClinic Development Server Launcher")
    print("=" * 60)

    if not check_dirs():
        sys.exit(1)

    for port in (8000, 3000):
        if port_in_use(port):
            print(
                f"ERROR: port {port} is already in use. Stop the existing server "
                "before running this launcher."
            )
            sys.exit(1)

    try:
        python_command = resolve_python()
    except RuntimeError as error:
        print(f"ERROR: {error}")
        sys.exit(1)

    # Start backend
    start_backend(python_command)

    # Wait for backend to be ready
    if not wait_for_backend():
        print("ERROR: Backend failed to start in time")
        tail_log("backend.log")
        cleanup()
        sys.exit(1)

    # Start frontend
    start_frontend()

    print("\n" + "=" * 60)
    print("Both servers are running!")
    print("=" * 60)
    print(f"Backend Python:  {' '.join(python_command)}")
    print("Backend API:     http://127.0.0.1:8000")
    print("API Docs:        http://127.0.0.1:8000/docs")
    print("Frontend:        http://localhost:3000")
    print("Health Check:    http://localhost:3000/health")
    print(f"Logs:            {LOG_DIR}")
    print("=" * 60)
    print("\nSign-in note:")
    print("  patient@demo.com / patient123")
    print("  doctor@demo.com / doctor123")
    print("  leena.das@demo.com / doctor123  (named doctors: arjun.bose, tara.dutta,")
    print("  samir.rao, aarav.das @demo.com, same password)")
    print("  admin@demo.com / admin123")
    print("=" * 60)
    print("\nPress Ctrl+C to stop both servers\n")

    try:
        # Keep running until interrupted
        while True:
            # Check if processes are still alive
            for p in processes:
                if p.poll() is not None:
                    print(f"\nProcess {p.pid} exited unexpectedly with code {p.returncode}")
                    tail_log("backend.log" if p is processes[0] else "frontend.log")
                    cleanup()
                    sys.exit(1)
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        cleanup()


if __name__ == "__main__":
    main()
