# Migrations

Creating the tables from scratch:

```sh
rm -f app/instance/app.db 
rm -rf migrations 
flask db init 
flask db migrate -m "initial schema"
flask db upgrade
```
1. Delete 
To migrate new tables and configurations, run:
```sh
flask db migrate -m "message"
flask db upgrade
```

# File Structure:

Routes and ORM models live inside the `app` folder. 

