import os
from datetime import datetime, timedelta
from inference import get_model
from uuid import uuid4
import cv2
import supervision as sv
from pathlib import Path
from sqlalchemy import select, func
from werkzeug.utils import secure_filename

from inference_sdk import InferenceHTTPClient

from .models import Ingredient, PantryItem, db

# initialize the client
CLIENT = InferenceHTTPClient(
    # FIX ME!
)

crop_dir = Path("cropped"); crop_dir.mkdir(exist_ok=True)
save_dir = Path("images"); save_dir.mkdir(exist_ok=True)
def clamp(val, lo, hi):                       # small util, avoids negative idx
    return max(lo, min(int(val), hi))

def process_image(img_path: Path):
    image = cv2.imread(str(img_path))
    print(img_path)
    result = CLIENT.infer(image, model_id="smart-pantry/3")
    print(result)

    detections = sv.Detections.from_inference(result)
    print(detections)

    H, W = image.shape[:2]
    
    crop_info = []                                # (path, class) for later use

    for i, (xyxy, cls_name) in enumerate(
            zip(detections.xyxy, detections.data["class_name"])):
        
        x1, y1, x2, y2 = map(int, xyxy)           # float32 → int
        x1, y1 = clamp(x1, 0, W-1), clamp(y1, 0, H-1)
        x2, y2 = clamp(x2, 0, W-1), clamp(y2, 0, H-1)

        crop = image[y1:y2, x1:x2]                # numpy slice = crop

        crop_path = crop_dir / f"{img_path.stem}_{i}_{cls_name}.jpg"
        cv2.imwrite(str(crop_path), crop)
        crop_info.append((crop_path.name, cls_name))
    return crop_info

def process_all_images(files, pantry_id):
    # First we save the images to a directory
    pantry_items = {}
    print(pantry_id)
    for file in files:
        print(file)
        ext = Path(secure_filename(file.filename)).suffix  # ".jpg", ".png", ...
        name = f"{uuid4().hex}{ext}"
        file.save(os.path.join(save_dir, name))

        classes = process_image(Path(save_dir) / name)
        for (crop_path, cls_name) in classes:
            cls_name = str(cls_name)
            if cls_name not in pantry_items.keys():
                pantry_items[cls_name] = {"image": crop_path, "quantity": 1}
            else:
                pantry_items[cls_name]["quantity"] += 1

    inserted_pantry_items = []
    for cls_name, item in pantry_items.items():
        ingredient = Ingredient.query.filter_by(name=cls_name).first()
        if ingredient is None:
            ingredient = Ingredient(name=cls_name, perishability=100)
            db.session.add(ingredient)
            db.session.commit()

        existing = (
        db.session.scalars(
                select(PantryItem)
                .where(
                    PantryItem.pantry_id == pantry_id,
                    PantryItem.ingredient_id == ingredient.id,
                )
                .limit(1)
            )
            .first()
        )

        if existing:
            # 2a) update in place
            existing.quantity += item["quantity"]
            existing.image = item["image"]
            pantry_item = existing
        else:
            # 2b) create new row
            pantry_item = PantryItem(
                pantry_id=pantry_id,
                ingredient_id=ingredient.id,
                quantity=item["quantity"],
                image=item["image"],
                expiration=datetime.now() + timedelta(days=ingredient.perishability),
            )
            db.session.add(pantry_item)
        db.session.commit()
        if pantry_item.id is not None:
            inserted_pantry_items.append(pantry_item)
    return len(inserted_pantry_items)

