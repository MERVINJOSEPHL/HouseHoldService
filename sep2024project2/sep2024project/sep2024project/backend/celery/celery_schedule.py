from celery import Celery
from celery.schedules import crontab
from flask import current_app as app
from backend.celery.task import serviceproviderreminder,usermonthlyreport
celery_app=app.extensions["celery"]

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
   #daily
   sender.add_periodic_task(crontab(hour=18,minute=00),serviceproviderreminder.s(),name="Service Provider Reminder")
   sender.add_periodic_task(crontab(hour=18,minute=00,day_of_month=23),usermonthlyreport.s(),name="User Report")
   