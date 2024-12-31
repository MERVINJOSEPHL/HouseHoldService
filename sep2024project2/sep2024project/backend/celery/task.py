from celery import shared_task
import time

import flask_excel
from backend.models import Review,db,User,ServiceRequest
from backend.celery.mail_service import serviceproviderremindertrigger,usermonthlyreporttrigger

@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y
    

@shared_task(bind = True, ignore_result = False)
def create_csv(self):
   
    resource =  db.session.query(Review.review_id.label("Request ID"),
    User.user_name.label("Customer Name"),
    ServiceRequest.service_provider_id.label("Service Provider ID"),
    ServiceRequest.date_of_register.label("DOR"),
    ServiceRequest.date_of_completion.label("DOC"),
    Review.contact_number.label("Contact Number"),
    Review.review_description.label("Review Description"),
    Review.rating.label("Rating")).join(User,User.userid==Review.customer_id).join(ServiceRequest,ServiceRequest.service_request_id==Review.review_id).all()
    print(resource)

    task_id = self.request.id
    filename = f'blog_data_{task_id}.csv'
    column_names = [column for column in ['Request ID',"Customer Name","Service Provider ID","DOR","DOC","Contact Number","Review Description","Rating"]]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(ignore_result=True)
def serviceproviderreminder():
    serviceproviderremindertrigger()

@shared_task(ignore_result=True)
def usermonthlyreport():
    usermonthlyreporttrigger()