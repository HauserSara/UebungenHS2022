import uvicorn
import sqlalchemy
import databases
from fastapi import FastAPI, Depends, Request, status, Form
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException

database = databases.Database('sqlite:///datenbank.db')
engine = sqlalchemy.create_engine('sqlite:///datenbank.db', connect_args={'check_same_thread': False})
metadata = sqlalchemy.MetaData()

notes = sqlalchemy.Table(
    'notes', metadata,
    sqlalchemy.Column('id', sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column('title', sqlalchemy.String),
    sqlalchemy.Column('text', sqlalchemy.String),
    sqlalchemy.Column('user', sqlalchemy.String)
)

metadata.create_all(engine)

app = FastAPI()
templates = Jinja2Templates(directory='templates/')

@app.on_event('startup')
async def startup():
    await database.connect()

@app.on_event('shutdown')
async def shutdown():
    await database.disconnect()

manager = LoginManager("jsk2e1urh3fku371", token_url="/auth/login", use_cookie=True)
manager.cookie_name = "ch.fhnw.testapp_hezd736"

DB = {"sara": {"name": "Sara Hauser",
                "email": "sara.hauser@roggli.org",
                "password": "sara"},
      "celine": {"name": "celine ",
                "email": "celine@gmx.net",
                "password": "celine"}
    }

@manager.user_loader()
def load_user(username: str):
    user = DB.get(username)
    return user

@app.post("/auth/login")
def login(data: OAuth2PasswordRequestForm = Depends()):
    username = data.username
    password = data.password
    user = load_user(username)

    if not user:
        raise InvalidCredentialsException
    elif password != user['password']:
        raise InvalidCredentialsException

    access_token = manager.create_access_token(
        data = {"sub": username}
    )

    resp = RedirectResponse(url="/private", status_code=status.HTTP_302_FOUND)
    manager.set_cookie(resp, access_token)

    return resp

@app.get("/login")
def login():
    file = open("templates/login.html", encoding="utf-8")
    data = file.read()
    file.close()
    return HTMLResponse(content=data)

@app.get("/private", response_class=HTMLResponse)
def getSecretPage(user=Depends(manager)):
    return "Hello " + user["name"]

@app.get("/notes")
async def read_notes():
    query = notes.select()
    return await database.fetch_all(query)

@app.get("/new")
async def create_note(request: Request):
    return templates.TemplateResponse('form.html', context={'request': request})

@app.post("/new")
async def post_note(request: Request, titel=Form(), text=Form(), user=Depends(manager)):
    query = notes.insert().values(title=titel, text=text)
    
    myid = await database.execute(query)
    return templates.TemplateResponse('form.html', context={'request': request})

@app.get("/users/{user}")
def user_posts(user=Depends(manager)):
    return {user["name"]}

uvicorn.run(app, host="127.0.0.1", port=8000)