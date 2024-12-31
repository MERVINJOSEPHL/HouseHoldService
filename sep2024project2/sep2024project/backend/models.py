from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin,RoleMixin
from datetime import datetime

db=SQLAlchemy()
class User(db.Model,UserMixin):
    userid=db.Column(db.Integer,primary_key=True)
    user_name=db.Column(db.String,nullable=False)
    address=db.Column(db.String,nullable=False)
    fullname=db.Column(db.String,nullable=False)
    pincode=db.Column(db.String,nullable=False)
    email=db.Column(db.String,unique=True,nullable=False)
    password=db.Column(db.String,nullable=False)
    service_provider_experience=db.Column(db.Integer)
    service_name=db.Column(db.String)
    cv = db.Column(db.String)
    isVerified=db.Column(db.Boolean,default=False)
    #flask-security specific
    fs_uniquifier=db.Column(db.String,unique=True,nullable=False)
    active=db.Column(db.Boolean,default=True)
    roles=db.Relationship('Role',backref='beares',secondary='user_role')
    service_requests=db.Relationship('ServiceRequest',backref='customer')
    services=db.Relationship('Services',backref='services')
    


class Role(db.Model,RoleMixin):
    roleid=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,unique=True,nullable=False)

class UserRole(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.userid'))
    role_id=db.Column(db.Integer,db.ForeignKey('role.roleid'))

class Services(db.Model):
    service_id=db.Column(db.Integer,primary_key=True)
    service_name=db.Column(db.String,unique=True,nullable=False)
    base_price=db.Column(db.String,nullable=False)
    description=db.Column(db.String)
    user_id=db.Column(db.Integer,db.ForeignKey('user.userid'))

    

class ServiceRequest(db.Model):
    service_request_id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.userid'))
    service_provider_id=db.Column(db.Integer)
    date_of_register=db.Column(db.DateTime,index=True,default=datetime.utcnow,nullable=False)
    date_of_completion=db.Column(db.DateTime)
    service_status=db.Column(db.String)
    remarks=db.Column(db.String)
    is_active_request=db.Column(db.Boolean,default=True)
    

class Review(db.Model):
    review_id=db.Column(db.Integer,primary_key=True)
    service_request_id=db.Column(db.Integer,db.ForeignKey('service_request.service_request_id'))
    customer_id=db.Column(db.Integer,db.ForeignKey('user.userid'))
    service_provider_id=db.Column(db.Integer)
    contact_number=db.Column(db.Integer)
    rating=db.Column(db.Integer)
    review_description=db.Column(db.String)
    review = db.relationship("ServiceRequest", overlaps="customer,service_requests")
    