from flask import current_app as app, jsonify, send_file
from flask_security import auth_required,SQLAlchemyUserDatastore,verify_password,hash_password
from flask import request,render_template
from backend.models import db
from backend.celery.task import add,create_csv
from celery.result import AsyncResult
from datetime import datetime
datastore:SQLAlchemyUserDatastore=app.security.datastore
cache=app.cache
@app.get("/")
def home():
    return render_template('index.html')
@app.get("/protected")
@auth_required()
def protected():
    return '<h1> only authenticated user can access it</h1>'

@app.get('/celery')
def celery():
    task = add.delay(10, 20)
    return {'task_id' : task.id}

@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 405
    
@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200

@app.get('/cache')
@cache.cached(timeout = 5)
def cache():
    return {'time' : str(datetime.now())}

@app.post("/login")
def login():
    data=request.get_json()
    email=data.get('email')
    password=data.get('password')
    if not email and not password:
        return jsonify({"error":"missing of email or password"}),404
    user=datastore.find_user(email=email)
    if not user:
        return jsonify({"error":"not a valid user"}),404
    if verify_password(password,user.password):
        return jsonify({'token':user.get_auth_token(),'email':user.email,'role':user.roles[0].name,'id':user.userid})
    else:
        return jsonify({'error':'password mismatch'}),400

@app.post("/Signup")
def signUp():
    data=request.get_json()
    username=data.get('username')
    address=data.get('address')
    fullname=data.get('fullname')
    pincode=data.get('pincode')
    email=data.get('email')
    password=data.get('password')
    roles=data.get('roles')
    if(roles=='serviceprovider'):
        document=data.get('document')
        servicename=data.get('service')
        experience=data.get('experience')

    if not email and not password and not username and not fullname and not address and not pincode and roles not in['serviceprovider','user']:
        return jsonify({"error":"missing of email or password"}),404
    user=datastore.find_user(email=email)
    if user:
        return jsonify({"error":"user already exisit"}),404
    try:
        if(roles=='serviceprovider'):
            datastore.create_user(user_name=username,address=address,fullname=fullname,pincode=pincode,email=email,password=hash_password(password),roles=[roles],cv=document,service_provider_experience=experience,service_name=servicename,active=True,isVerified=False)
        else:
            datastore.create_user(user_name=username,address=address,fullname=fullname,pincode=pincode,email=email,password=hash_password(password),roles=[roles],active=True,isVerified=False)
        db.session.commit()
        return jsonify({"message":"user Created"}),200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message':"error creating user"}),400
    


    