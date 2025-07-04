from app import create_app
import os
import signal
import sys

FLASK_ENV = os.getenv("FLASK_ENV", "development")
PORT = int(os.getenv("PORT", 5000))

app = create_app()

def handle_exit(sig, frame):
    """Handle termination signals for graceful shutdown."""
    print("\n🛑 Shutting down Flask server gracefully...")
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)   
signal.signal(signal.SIGTERM, handle_exit) 

if __name__ == "__main__":
    debug_mode = FLASK_ENV.lower() == "development"
    print(f"Starting Flask app in {FLASK_ENV.upper()} mode on port {PORT}...")
    app.run(host="0.0.0.0", port=PORT, debug=debug_mode)
