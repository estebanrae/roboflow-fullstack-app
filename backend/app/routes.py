from flask import Blueprint, request, jsonify, abort
from sqlalchemy.orm import joinedload

from .find_items import process_all_images
from .models import db, Pantry, PantryItem, Ingredient

api_bp = Blueprint("api", __name__)

from flask import Response
    
@api_bp.route("/pantry", methods=["POST"])
def create_pantry():
    data = request.get_json(silent=True) or {}   # returns {} instead of None
    name = data.get("name", "").strip()

    if not name:
        abort(400, "name missing")
    pantry = Pantry(name=name)
    db.session.add(pantry)
    db.session.commit()
    return jsonify(id=pantry.id), 201

@api_bp.route("/pantries/", methods=["GET"])
def get_pantries():
    pantries = Pantry.query.all()
    return jsonify(
        [
            {
                "id": pantry.id,
                "name": pantry.name,
            }
            for pantry in pantries
        ]
    )

@api_bp.route("/pantry/<int:pantry_id>", methods=["GET"])
def get_pantry(pantry_id):
    print("SDADA")
    pantry = (
        Pantry.query.options(
            joinedload(Pantry.items)                 # Pantry → PantryItem
            .joinedload(PantryItem.ingredient)       # PantryItem → Ingredient
        )
        .filter_by(id=pantry_id)
        .first()
    )
    if pantry is None:
        abort(404, description="Pantry not found")
    
    return jsonify(
        id=pantry.id,
        name=pantry.name,
        items=[
            {
                "id": item.id,
                "ingredient": {
                    "id": item.ingredient.id,
                    "name": item.ingredient.name,
                    "perishability": item.ingredient.perishability,
                },
                "quantity": item.quantity,
                "image": item.image,
                "expiration": item.expiration.isoformat() if item.expiration else None,
            }
            for item in pantry.items
        ],
    )

@api_bp.route("/consume", methods=["POST"])
def consume_items():
    data = request.get_json(silent=True) or {}
    items = data.get("items", "")
    item_ids = items.keys()
    items_obj = PantryItem.query.filter(
        PantryItem.id.in_(item_ids)
    ).all()

    for pi in items_obj:
        # guard: don't go negative
        if pi.quantity > 0:
            print(items)
            if pi.quantity - items[str(pi.id)]["quantity"] <= 0:
                db.session.delete(pi)
            else:
                pi.quantity -= items[str(pi.id)]["quantity"]
            db.session.commit()
    db.session.commit() 
    return "success", 200

@api_bp.route("/upload", methods=["POST"])
def upload_images():
    images = request.files.getlist("files")
    pantry_id  = request.form.get("pantry_id")
    return jsonify(count=process_all_images(images, pantry_id)), 201

    # if not name:
    #     abort(400, "name missing")
    # pantry = Pantry(name=name)
    # db.session.add(pantry)
    # db.session.commit()
    # return jsonify(id=pantry.id), 201