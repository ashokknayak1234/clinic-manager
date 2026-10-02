#!/usr/bin/env python3
"""
OpenClinic Development Server Launcher
Starts both backend (FastAPI) and frontend (Vite) servers.
"""
import subprocess
import sys
import os
import time
import signal
import atexit
from pathlib import Path

BACKEND_DIR = Path(__file__).parent / "backend"
FRONTEND_DIR = Path(__file__).parent / "frontend"

processes = []

def cleanup():
    """Terminate all child processes on exit."""
    for p in processes:
        if p.poll() is None:
            print(f"\nStopping {p.args[0]} (PID {p.pid})...")
            p.terminate()
            try:
                p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                p.kill()

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

def start_backend():
    """Start FastAPI backend on port 8000."""
    print("Starting backend (FastAPI) on http://127.0.0.1:8000 ...")
    env = os.environ.copy()
    # Ensure we use the correct Python
    cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8000", "--host", "0.0.0.0"]
    # Use DEVNULL to avoid pipe buffer issues that kill the subprocess
    p = subprocess.Popen(cmd, cwd=BACKEND_DIR, env=env,
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    processes.append(p)
    return p

def start_frontend():
    """Start Vite frontend on port 5173."""
    print("Starting frontend (Vite) on http://localhost:5173 ...")
    env = os.environ.copy()
    cmd = ["npm", "run", "dev"]
    # Use DEVNULL to avoid pipe buffer issues
    p = subprocess.Popen(cmd, cwd=FRONTEND_DIR, env=env, shell=True,
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    processes.append(p)
    return p

def wait_for_backend(max_wait=30):
    """Wait for backend health endpoint to respond."""
    import requests
    url = "http://127.0.0.1:8000/api/v1/health"
    for i in range(max_wait):
        try:
            r = requests.get(url, timeout=2)
            if r.status_code == 200:
                print("Backend is ready!")
                return True
        except Exception:
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

    # Start backend
    backend_proc = start_backend()
    time.sleep(2)

    # Wait for backend to be ready
    if not wait_for_backend():
        print("ERROR: Backend failed to start in time")
        cleanup()
        sys.exit(1)

    # Start frontend
    frontend_proc = start_frontend()

    print("\n" + "=" * 60)
    print("Both servers are running!")
    print("=" * 60)
    print("Backend API:     http://127.0.0.1:8000")
    print("API Docs:        http://127.0.0.1:8000/docs")
    print("Frontend:        http://localhost:5173")
    print("Health Check:    http://localhost:5173/health")
    print("=" * 60)
    print("\nDemo Accounts:")
    print("  Admin:      admin@demo.com     / admin123")
    print("  Doctor:     doctor@demo.com    / doctor123")
    print("  Patient:    patient@demo.com   / patient123")
    print("=" * 60)
    print("\nPress Ctrl+C to stop both servers\n")

    try:
        # Keep running until interrupted
        while True:
            # Check if processes are still alive
            for p in processes:
                if p.poll() is not None:
                    print(f"\nProcess {p.pid} exited unexpectedly with code {p.returncode}")
                    cleanup()
                    sys.exit(1)
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        cleanup()

if __name__ == "__main__":
    main()