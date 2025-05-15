from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from pathlib import Path

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, 
                static_folder="static",       # keeps built‑in /static
            static_url_path="/static")
    
    CORS(app)
    
    app.static_folder = str(Path("..") / "cropped")  # static files
            
    # database URL: swap in Postgres/MySQL when ready
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    print("CORS enabled")

    db.init_app(app)
    migrate.init_app(app, db)
    # blueprint registration
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app