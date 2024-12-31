from flask import Flask
from backend.config import LocalDevelopementConfig
from backend.models import db, User, Role
from flask_security import Security,SQLAlchemyUserDatastore,auth_required
from flask_caching import Cache
from backend.celery.celery_factory import celery_init_app
import flask_excel as excel
def createApp():
    app=Flask(__name__,template_folder='frontend',static_folder='frontend',static_url_path='/static')
    app.config.from_object(LocalDevelopementConfig)
    #model initialization
    db.init_app(app)
    cache=Cache(app)
    datastore=SQLAlchemyUserDatastore(db, User, Role)
    app.cache=cache
    app.security=Security(app,datastore=datastore,register_blueprint=False)
    app.app_context().push()
    from backend.resources import api
    api.init_app(app)
    return app
app=createApp()
celery_app = celery_init_app(app)
from backend.celery import celery_schedule
from backend import create_initial_data
from backend import routes

excel.init_excel(app)

if(__name__=="__main__"):
    app.run()

