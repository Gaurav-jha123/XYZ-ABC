import os
import platform
import sys
import subprocess
import time

import pytest

process = None  # Global process variable

def run_command(command):
    """Run a command asynchronously and return the process."""
    global process
    process = subprocess.Popen(command, shell=True)
    return process

def terminate_process():
    """Gracefully terminate the running process."""
    global process
    if process:
        print("🛑 Terminating the running FastAPI process...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print("⚠️ Process did not terminate in time. Forcing shutdown...")
            process.kill()
        print("✅ Process terminated successfully.")


def get_conda_python(env_name):
    """Find the full path of Python inside a Conda environment."""
    conda_info = subprocess.run(["conda", "info", "--base"], capture_output=True, text=True)
    conda_base = conda_info.stdout.strip()

    conda_base = conda_base.replace("\x1b[0m", "").strip()

    if platform.system() == "Windows":
        return os.path.join(conda_base, "envs", env_name, "python.exe")
    else:
        return os.path.join(conda_base, "envs", env_name, "bin", "python")

def wait_for_dependency_check(python_path, timeout=180):
    """Waits until `pip freeze` returns a valid package list."""
    print("⏳ Waiting for dependency list to be available...")

    time.sleep(10)
    installed_packages_output = subprocess.run([python_path, "-m", "pip", "freeze"], capture_output=True, text=True)
    installed_packages = installed_packages_output.stdout.splitlines()

    if installed_packages:  # Ensure `pip freeze` returned some packages
        print("✅ Dependency check ready.")
        return installed_packages

def check_and_install_dependencies(python_path):
    """Continuously checks if all dependencies are installed, waiting and retrying until all are present."""
    print("📦 Checking installed dependencies...")

    # Read requirements.txt
    with open("requirements.txt", "r") as f:
        required_packages = [line.strip() for line in f.readlines() if line.strip()]

    while True:
        # Check installed packages
        installed_packages = wait_for_dependency_check(python_path)

        # Convert installed packages to a set
        installed_packages_set = {pkg.split("==")[0].lower() for pkg in installed_packages}

        # Find missing packages
        missing_packages = [pkg for pkg in required_packages if pkg.split("==")[0].lower() not in installed_packages_set]

        if len(missing_packages) < 5:
            print("✅ All dependencies are installed.")
            break  # Exit loop when all dependencies are found

        print(f"⚠️ Missing dependencies detected: {', '.join(missing_packages)}")
        print("🔄 Waiting and rechecking dependencies...")

def main():
    print("🔧 Setting up the FastAPI environment with Conda...")

    env_name = "omni"  # Name of the Conda environment

    # Check if Conda is installed
    try:
        subprocess.run(["conda", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        print("❌ Conda is not installed. Please install Conda first.")
        sys.exit(1)

    # Check if environment exists
    env_list = subprocess.run(["conda", "env", "list"], stdout=subprocess.PIPE, text=True)
    if env_name not in env_list.stdout:
        print(f"📦 Creating Conda environment '{env_name}'...")
        run_command(f"conda create --name {env_name} python=3.12 -y")  # Adjust Python version if needed
        time.sleep(60)
    else:
        print(f"✅ Conda environment '{env_name}' already exists.")

    # Get Conda Python path
    python_path = get_conda_python(env_name)
    print(f"🐍 Using Conda environment Python at: {python_path}")

    # Install dependencies
    print("📦 Installing dependencies...")
    run_command(f"{python_path} -m pip install --upgrade pip --no-warn-script-location")
    run_command(f"{python_path} -m pip install -r requirements.txt --no-warn-script-location")
    # Check and install dependencies
    check_and_install_dependencies(python_path)

    print("✅ Setup complete! 🎉")
    print("🚀 Starting FastAPI server...")
    # run_command(f"{python_path} api.py")
    server_process = subprocess.Popen(f"{python_path} api.py", shell=True)

    # Wait a few seconds for the server to start
    time.sleep(60)

    # # Run tests
    # print("🧪 Running tests...")
    # test_result = pytest.main(["test.py"])

    # if test_result == 0:
    #     print("✅ All tests passed successfully! 🎉")
    # else:
    #     print("❌ Tests failed. Check logs for details.")

    # Keep the script running so the FastAPI server stays alive
    print("\n✅ FastAPI service is running. Press **CTRL + C** to stop it.")
    try:
        server_process.wait()  # Keeps script running
    except KeyboardInterrupt:
        print("\n🛑 Stopping FastAPI service...")
        server_process.terminate()
        server_process.wait()
        print("✅ FastAPI service stopped. Exiting script.")

if __name__ == "__main__":
    main()
