import os
import subprocess
import sys

def start_backend():
    backend_path = os.path.join(os.getcwd(), "backend")
    subprocess.Popen([sys.executable, "manage.py", "runserver"], cwd=backend_path)

def start_frontend():
    frontend_path = os.path.join(os.getcwd(), "frontend")
    subprocess.Popen(["npm", "start"], cwd=frontend_path, shell=True)

if __name__ == "__main__":
    print("Iniciando backend e frontend...")
    start_backend()
    start_frontend()
    print("Servidores iniciados.")
