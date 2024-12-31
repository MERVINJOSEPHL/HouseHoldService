import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from backend.models import ServiceRequest,User,UserRole,db
from flask import Flask, render_template_string
from datetime import datetime
from sqlalchemy import extract
SMTP_SERVER='localhost'
SMTP_PORT=1025
SENDER_EMAIL='Admin@Mail.com'
SENDER_PASSWORD=''

def send_email(to,subject,content):
    msg=MIMEMultipart()
    msg['To']=to
    msg['Subject']=subject
    msg['From']=SENDER_EMAIL
    msg.attach(MIMEText(content,'html'))

    with smtplib.SMTP(host=SMTP_SERVER,port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()

def serviceproviderremindertrigger():
    user=db.session.query(User).join(ServiceRequest,ServiceRequest.service_provider_id==User.userid).join(UserRole,UserRole.user_id==User.userid).filter(UserRole.role_id==2, ServiceRequest.service_status=="pending").all()
    for i in user:
        mailval=db.session.query(ServiceRequest.service_request_id,ServiceRequest.date_of_register,User.email).join(User,User.userid==ServiceRequest.user_id).filter(ServiceRequest.service_provider_id==i.userid).all()
        template='''<table>
                            <tr>
                                <td>Request ID</td>
                                <td>Date of Register</td>
                                <td>User Email</td>
                            </tr>
                        {% for row in table_data %}
                            <tr>
                                {% for cell in row %}
                                    <td>{{ cell }}</td>
                                {% endfor %}
                                <td><a href="http://127.0.0.1:5000/?#/"/>View</td>
                            </tr>
                        {% endfor %}
                    </table>
                '''
        rendercontent=render_template_string(template, table_data=mailval)
        send_email(i.email,"Pending Request",rendercontent)
        # print(i[0].email,i[1].service_request_id,i[1].date_of_register)

def usermonthlyreporttrigger():
    user=db.session.query(User).join(UserRole,UserRole.user_id==User.userid).filter(UserRole.role_id==3).all()
    current_year = datetime.now().year
    current_month = datetime.now().month
    for i in user:
        mailval=db.session.query(ServiceRequest.service_request_id,ServiceRequest.date_of_register,ServiceRequest.date_of_completion,ServiceRequest.service_status,User.email).join(User,User.userid==ServiceRequest.user_id).filter(ServiceRequest.user_id==i.userid, current_month == extract('month', ServiceRequest.date_of_register),current_year == extract('year', ServiceRequest.date_of_register)).all()
        template='''<table border="1px solid black">
                            <tr>
                                <td>Request ID</td>
                                <td>Date of Register</td>
                                <td>Date of Completion</td>
                                <td>Service Status</td>
                                <td>User Email</td>
                            </tr>
                        {% for row in table_data %}
                            <tr>
                                {% for cell in row %}
                                    <td>{{ cell }}</td>
                                {% endfor %}
                                <td><a href="http://127.0.0.1:5000/?#/"/>View</a></td>
                            </tr>
                        {% endfor %}
                    </table>
                '''
        rendercontent=render_template_string(template, table_data=mailval)
        if(len(mailval)!=0):
            send_email(i.email,"Monthly Report",rendercontent)
        else:
            send_email(i.email,"Monthly Report",'''<h1>Turn Missed to Booked <a href="http://127.0.0.1:5000/?#/"/>View</a> </h1>''')
