
ingredients = [
    {
        "name": "peanut butter",
        "perishability": 180,
    },
    {
        "name": "cereal box",
        "perishability": 180,
    },
    {
        "name": "milk",
        "perishability": 14,
    },
    {
        "name": "bell pepper",
        "perishability": 7,
    },
    {
        "name": "bread",
        "perishability": 15,
    },
    {
        "name": "carrots",
        "perishability": 20,
    },
    {
        "name": "cheese",
        "perishability": 40,
    },
    {
        "name": "garlic",
        "perishability": 30,
    },
    {
        "name": "ketchup",
        "perishability": 360,
    },
    {
        "name": "orange",
        "perishability": 15,
    },
    {
        "name": "parmesan",
        "perishability": 25,
    },
    {
        "name": "pasta",
        "perishability": 200,
    },
    {
        "name": "spicy sauce",
        "perishability": 100,
    },
    {
        "name": "tomato sauce",
        "perishability": 200,
    },
    {
        "name": "tortillas",
        "perishability": 45,
    },
    {
        "name": "yogurt",
        "perishability": 25,
    },
]

if __name__ == "__main__":
    from app import create_app
    from app.models import db, Ingredient

    app = create_app()
    with app.app_context():
        db.create_all()
        for ingredient in ingredients:
            new_ingredient = Ingredient(
                name=ingredient["name"],
                perishability=ingredient["perishability"],
            )
            db.session.add(new_ingredient)
        db.session.commit()