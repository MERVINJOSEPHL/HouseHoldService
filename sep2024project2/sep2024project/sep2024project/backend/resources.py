from flask import request,current_app as app
from flask_restful import Api, Resource,marshal_with,fields
from flask_security import auth_required,current_user
from backend.models import Services,Review,UserRole,ServiceRequest,User,db
from datetime import datetime
from sqlalchemy import and_
cache=app.cache
api=Api(prefix='/api')
service_fields={
    'service_id':fields.Integer,
    'service_name':fields.String,
    'base_price':fields.String,
    'description':fields.String,
}
service_request_fields = {
    'service_request_id': fields.Integer,
    'user_id': fields.Integer,
    'service_provider_id': fields.Integer,
    'date_of_register': fields.DateTime,      
    'date_of_completion': fields.DateTime,    
    'service_status': fields.String,
    'remarks': fields.String,
    'is_active_request': fields.Boolean,
}
user_fields={
    'userid':fields.Integer,
    'user_name':fields.String,
    'address':fields.String,
    'fullname':fields.String,
    'pincode':fields.String,
    'email':fields.String,
    'password':fields.String,
    'service_provider_experience':fields.Integer,
    'service_name':fields.String,
    'cv' : fields.String,
    'isVerified':fields.String,
    'active':fields.String
}
combined_fields = {
    'service_request': fields.Nested(service_request_fields),
    'user': fields.Nested(user_fields),
}
combined_fields_service_serviceprofessional={
    'services': fields.Nested(service_fields),
    'user': fields.Nested(user_fields),
}

class NewServices(Resource):
    def post(self):
        try:
            print("I am in post of new services")
            data=request.get_json()
            servicename=data.get("serviceName")
            description=data.get("description")
            baseprice=data.get("baseprice")
            role=data.get("role")
            if(role=='admin'):
                service=Services(service_name=servicename,base_price=baseprice,description=description)
                db.session.add(service)
                db.session.commit()
                return{"Message":"Successfully Createad a Service"},200
            else:
                return{"Message":"Unauthorized Access"},500
        except Exception as e:
            return {"Message":"Error Occured While Creating New Service"},500
    @marshal_with({"services":fields.List(fields.Nested(service_fields)),"servicerequestdata":fields.List(fields.Nested(service_request_fields)),"professionaldetails":fields.List(fields.Nested(user_fields))})
    @auth_required() 
    def get(self):
        try:
            print("I am in get of new services")
            services=Services.query.all()
            servicerequestdata=ServiceRequest.query.all()
            professionaldetails=db.session.query(User).join(UserRole,UserRole.user_id==User.userid).filter(UserRole.role_id==2).all()
            print(professionaldetails)
            if(not services):
                return{"Message":"No Service Available"},400
            return {"services":services,"servicerequestdata":servicerequestdata,"professionaldetails":professionaldetails}
        except Exception as e:
            print(e)
            return {"Message":"Error Occured While Creating New Service"},500
    @auth_required()
    def put(self):
        print("I am in put of new services")
        try:
            body=request.get_json()
            print(body)
            if(body.get('service_id')!=""):
                print("I am in Service Updation")
                servicedetails=db.session.query(Services).filter(Services.service_id==body.get('service_id')).first()
                print(servicedetails)
                if(body.get('serviceName')!="",body.get('baseprice')!="",body.get('description')!=""):
                    servicedetails.service_name=body.get('serviceName')
                    servicedetails.base_price=body.get('baseprice')
                    servicedetails.description=body.get('description')
                    db.session.commit()
                    return{"Message":"Successfully Altered a Service"},200
                else:
                    return {"Message":"Service related information is Missing"},404
            elif(body.get("service_professionalId")):
                print("I am in Service Professional Updation",body.get("isVerified"))

                serviceprofessionaldetails=db.session.query(User).filter(User.userid==body.get('service_professionalId')).first()
                serviceprofessionaldetails.isVerified=True if body.get("isVerified")=="True" else False
                serviceprofessionaldetails.active=False if body.get("isVerified")!="True" else True 
                db.session.commit()
                return{"Message":"Successfully Altered a Service Professionals"},200
            else:
                return {"Message":"Service id is Missing"},404


        except Exception as e:
            print(e)
            return {"Message":"Error Occured While Editing Existing Service"},500
    @auth_required()   
    def delete(self):
        body=request.get_json()
        service=Services.query.get(body.get("service_id"))
        try:
            db.session.delete(service)
            db.session.commit()
            return {"Message":"Successfully deleted the service"},200
        except Exception as e:
            print(e)
            return {"Message":"Failed Deleteion of service"},500

api.add_resource(NewServices,'/newservices')

class CreateServiceRequest(Resource):
    @auth_required()
    def post(self):
        try:
            data=request.get_json()
            service_provider_id=data.get('serviceProviderId')
            customer_id=data.get('customer_id')
            service_name=data.get('service_name')
            servicerdetails=db.session.query(User).filter(User.userid==service_provider_id,User.service_name==service_name).first()
            print(service_provider_id)
            print(service_name)
            print(servicerdetails)
            if servicerdetails:
                servicerequest=ServiceRequest(user_id=customer_id,service_provider_id=service_provider_id,service_status='pending',is_active_request=True)
                db.session.add(servicerequest)
                db.session.commit()
                return {"Message":"Service Created Successfully"},200
            else:
                return{"Message":"No Service Person Available"},400
        except Exception as e:
            print(e)
            return {"Message":"Error Occured While Creating Service Register"},500
    @marshal_with(combined_fields)
    @auth_required()
    def delete(self):
        print(request.get_json().get('customer_id'))
        try:
            searchFields={
                "date_of_register":ServiceRequest.date_of_register,
                "pincode":User.pincode,
                "email":User.email,
                "status":ServiceRequest.service_status
            }
            searchtearm=request.get_json().get("searchtearm")
            searchvalue=request.get_json().get("searchvalue") 
            filters=[]
            ServiceRequestData=""
            if(request.get_json().get('serviceProviderId')):
                serviceProviderId=request.get_json().get('serviceProviderId')
                print(request.get_json())
                ServiceRequestData=db.session.query(ServiceRequest,User).join(User,User.userid==ServiceRequest.user_id)
                filters=[ServiceRequest.service_provider_id==serviceProviderId,ServiceRequest.is_active_request==True]
                if(searchtearm in ['date_of_register','pincode','email']):
                    print(searchFields[searchtearm])
                    print(f"%{searchvalue}%")
                    filters.append(searchFields[searchtearm].like(f"%{searchvalue}%"))
                    pass
                ServiceRequestData=ServiceRequestData.filter(and_(*filters)).all()
                print(ServiceRequestData)
                result = [{'service_request': service_request, 'user': user} for service_request, user in ServiceRequestData]
                return result
            else:
                print("Inside customer validation")
                customerId=request.get_json().get('customer_id')
                if(customerId!=""):
                    ServiceRequestData=db.session.query(ServiceRequest,User).join(User,User.userid==ServiceRequest.service_provider_id).filter(ServiceRequest.user_id==customerId,ServiceRequest.is_active_request==True).all()
                else:
                    ServiceRequestData=db.session.query(ServiceRequest,User).join(User,User.userid==ServiceRequest.service_provider_id)
                    if(searchtearm in ['date_of_register','status']):
                        filters.append(searchFields[searchtearm].like(f"%{searchvalue}%"))
                        ServiceRequestData=ServiceRequestData.filter(and_(*filters))
                    ServiceRequestData=ServiceRequestData.all()

                result = [{'service_request': service_request, 'user': user} for service_request, user in ServiceRequestData]
                return result

        except Exception as e:
            print(e)
            return {"Message":"Error Occured While Getting Servicer Register"},500
    @auth_required()
    def put(self):
        body=request.get_json()
        if(body.get("action")=="serviceproviderapproval"):
            servicerequestid=body.get("service_request_id")
            approval=body.get("approval")
            service=ServiceRequest.query.get(servicerequestid)
            service.service_status=approval
            db.session.commit()
            return{"Message":"Successfully Updated ServiceRequesr"},200
        elif(body.get("action")=="customerclose"):
            servicerequestid=body.get("service_request_id")
            approval=body.get("approval")
            service=ServiceRequest.query.get(servicerequestid)
            service.service_status=approval
            service.remarks=body.get("remarks")
            db.session.commit()
            return{"Message":"Successfully Updated ServiceRequesr"},200
        else:
            return {"Message":"Action not defined"},400

        
api.add_resource(CreateServiceRequest,'/createserviceregister')


class GetAllServices(Resource):
    @cache.cached(timeout=5)
    @marshal_with(service_fields)
    def get(self):
        services=Services.query.all()
        return services
api.add_resource(GetAllServices,'/getallservices')
class GetSpecificServices(Resource):
    @auth_required()
    @marshal_with(combined_fields_service_serviceprofessional)
    def put(self):
        body=request.get_json()
        searchTearm=body.get("searchTearm")
        searchValue=body.get("searchValue")

        searchFields={
            "ServiceID":Services.service_id,
            "PINCode":User.pincode
        }
        if(searchTearm=="ServiceID"):
            filterqu=searchFields[searchTearm]==searchValue
        else:
            print(searchTearm)
            print(searchValue)
            filterqu=searchFields[searchTearm].like(f"%{searchValue}%")
        ServiceData=db.session.query(Services,User).join(User,User.service_name==Services.service_name).filter(User.isVerified==True,filterqu).all()
        print(ServiceData)
        result = [{'services': services, 'user': user} for services, user in ServiceData]
        print(result)
        return result
api.add_resource(GetSpecificServices,'/getspecificservices')

class FeedBack(Resource):
    @auth_required()
    @marshal_with(combined_fields)
    def get(self):
        body=request.get_json()
        service_request_id=body.get("service_request_id")
        feedback=db.session.query(ServiceRequest,User).join(User,User.userid==ServiceRequest.service_provider_id).filter(ServiceRequest.service_request_id==service_request_id)
        result = [{'service_request': services, 'user': user} for services, user in feedback]
        return result
    @auth_required()
    def post(self):
        try:
            body=request.get_json()
            service_request_id=body.get('service_request_id')
            customer_id=body.get('customer_id')
            service_provider_id=body.get('service_provider_id')
            contact_number=body.get('contact_number')
            rating=body.get('rating')
            review_description=body.get('description')
            review=Review(service_provider_id=service_provider_id,contact_number=contact_number,rating=rating,review_description=review_description,customer_id=customer_id,service_request_id=service_request_id)
            db.session.add(review)
            db.session.commit()
            servicerequest=ServiceRequest.query.get(service_request_id)
            servicerequest.service_status='completed'
            servicerequest.date_of_completion=datetime.utcnow()
            servicerequest.remarks=str(rating)
            db.session.commit()
            return {"Message":"Successfully Closed the Service"},200
        except Exception as e:
            print(e)
            return {"Message":"Error during the Closing Service"},500
        
api.add_resource(FeedBack,'/feedbackprocess')
