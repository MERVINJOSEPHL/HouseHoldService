from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore,hash_password
with app.app_context():
    db.create_all()
    userdatastore:SQLAlchemyUserDatastore=app.security.datastore
    userdatastore.find_or_create_role(name='admin')
    userdatastore.find_or_create_role(name='serviceprovider')
    userdatastore.find_or_create_role(name='user')
    if (not userdatastore.find_user(email = 'admin@study.iitm.ac.in')):
        userdatastore.create_user(user_name='iitmadmin',fullname='iitmadmin',address='iitm st, iit chennai',pincode='600059',email = 'admin@study.iitm.ac.in', password = hash_password('pass'), roles = ['admin'] )
    db.session.commit()




    