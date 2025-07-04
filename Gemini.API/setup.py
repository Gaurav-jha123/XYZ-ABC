import os
import sys
import subprocess

process = None  

def run_command(command):
    """Run a command asynchronously and return the process."""
    global process
    process = subprocess.Popen(command, shell=True)
    return process

def terminate_process():
    """Gracefully terminate the running process."""
    global process
    if process:
        print("🛑 Terminating the running Flask process...")
        process.terminate() 
        try:
            process.wait(timeout=5)  
        except subprocess.TimeoutExpired:
            print("⚠️ Process did not terminate in time. Forcing shutdown...")
            process.kill()  
        print("✅ Process terminated successfully.")

def main():
    print("🔧 Setting up the Flask environment...")

    is_windows = sys.platform.startswith("win")
    venv_dir = "venv"

    if is_windows:
        venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
    else:
        venv_python = os.path.join(venv_dir, "bin", "python")

    if not os.path.exists(venv_dir):
        print("📦 Creating virtual environment...")
        run_command(f"python -m venv {venv_dir}")

    print("📦 Installing dependencies...")
    run_command(f"{venv_python} -m pip install --upgrade pip")
    run_command(f"{venv_python} -m pip install -r requirements.txt")

    FLASK_ENV = os.getenv("FLASK_ENV", "development") 
    PORT = os.getenv("PORT", "5000") 

    print(f"🚀 Running Flask in {FLASK_ENV.upper()} mode on port {PORT}...")

    process = run_command(f"{venv_python} main.py")

    try:
        process.wait() 
    except KeyboardInterrupt:
        print("\n🛑 Received KeyboardInterrupt. Cleaning up...")
        terminate_process()

if __name__ == "__main__":
    main()
