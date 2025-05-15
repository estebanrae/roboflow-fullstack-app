from datetime import datetime
from . import db

class Pantry(db.Model):
    __tablename__ = "pantries"

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    items = db.relationship(
        "PantryItem",          # the child class
        back_populates="pantry",
        cascade="all, delete-orphan",
        # lazy="dynamic",        # query‑style access: pantry.items.filter(...)
    )

# ---------- Ingredients ----------
class Ingredient(db.Model):
    __tablename__ = "ingredients"

    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(128), nullable=False, unique=True)
    perishability  = db.Column(db.Integer, nullable=False)  # days

    # reverse helpers (not strictly required, but handy):
    recipes        = db.relationship(
        "Recipe",
        secondary="recipe_ingredients",
        back_populates="ingredients",
        lazy="dynamic",
    )
    pantry_items   = db.relationship("PantryItem", back_populates="ingredient")

    def __repr__(self) -> str:
        return f"<Ingredient {self.name} ({self.perishability} d)>"

# ---------- Recipes ----------
# Association table — recipes ⟷ ingredients (no extra columns)
recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Column("recipe_id",      db.Integer, db.ForeignKey("recipes.id"), primary_key=True),
    db.Column("ingredient_id",  db.Integer, db.ForeignKey("ingredients.id"), primary_key=True),
)

class Recipe(db.Model):
    __tablename__ = "recipes"

    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(128), nullable=False, unique=True)
    instructions  = db.Column(db.Text, nullable=False)  # use Text for rich / long strings

    ingredients   = db.relationship(
        "Ingredient",
        secondary=recipe_ingredients,
        back_populates="recipes",
        lazy="dynamic",
    )

    def __repr__(self) -> str:
        return f"<Recipe {self.name}>"

# ---------- PantryItems ----------
# Association *object* — pantries ⟷ ingredients, *with* extra columns
class PantryItem(db.Model):
    __tablename__ = "pantry_items"

    id             = db.Column(db.Integer, primary_key=True)
    pantry_id      = db.Column(db.Integer, db.ForeignKey("pantries.id"), nullable=False)
    ingredient_id  = db.Column(db.Integer, db.ForeignKey("ingredients.id"), nullable=False)

    quantity       = db.Column(db.Float, nullable=False, default=1)
    expiration     = db.Column(db.Date,  nullable=True)

    image          = db.Column(db.String(128), nullable=True)

    # relationships
    pantry     = db.relationship("Pantry",     back_populates="items")
    ingredient = db.relationship("Ingredient", back_populates="pantry_items")

    def __repr__(self) -> str:
        return f"<PantryItem {self.quantity}× {self.ingredient.name}>"

