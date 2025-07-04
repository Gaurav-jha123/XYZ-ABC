from flask import Blueprint, send_from_directory, abort
import os

path_bp = Blueprint('path', __name__)

WEB_DIRECTORY = os.path.abspath("web")  

@path_bp.route('/<path:path>', methods=['GET'])
def serve_static(path):
    safe_path = os.path.abspath(os.path.join(WEB_DIRECTORY, path))
    
    if not safe_path.startswith(WEB_DIRECTORY):  
        abort(403) 

    if not os.path.exists(safe_path):  
        abort(404) 

    return send_from_directory(WEB_DIRECTORY, path)
