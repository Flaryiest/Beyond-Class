import os, json, psycopg2, time, random, uuid, hashlib, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from math import ceil
from flask import Flask, request, jsonify, make_response
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS
from datetime import datetime, timedelta

load_dotenv() 

'''EMAIL, PASSWORD = [os.environ.get(i) for i in ["EMAIL", "EMAIL_PASSWORD"]]

def get_base(email):
    local_part, domain = email.split('@')
    normalized_local = local_part.split('+')[0].replace('.', '')
    base_email = f'{normalized_local}@{domain}'
    
    return base_email

def send_email(recipient, key):
    try:
        msg = MIMEMultipart('alternative')

        html = f"""
        <html>
        <body>
        <div style="display: flex; align-items: center; justify-content: center; border-radius: 10px; border-style: groove; padding-left: 50px; padding-right: 50px; padding-bottom: 50px;">
            <div style="justify-content: center; align-items: center;">
                <h1>BeyondClass - Register</h1>
                <p>Hello! Click the link below to register your account!</p><br>
                <p>If this was not you, please close this email.</p><br>
                <a style="padding: 10px; border-radius: 0; background-color: white; border-style: solid; color: #000; text-decoration: none;" href="http://184.64.116.12:3333/verify?code={key}">Click here to register</a>
            </div>
        </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html, 'html'))
        
        msg['Subject'] = "BeyondClass email verification"
        msg['From'] = EMAIL
        msg['To'] = recipient

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(EMAIL, PASSWORD)
            smtp_server.sendmail(EMAIL, [recipient], msg.as_string())

        return True
    except Exception: #there is a lot of exceptions without specific errors in this file, may be a - score for us (bad programming)
        return False
'''

def get_streak(l_date):
    date = datetime.now()
    p_date = date - timedelta(days=1)
    if l_date == f"{date.day}_{date.month}_{date.year}":
        return True, 0
    elif l_date == f"{p_date.day}_{p_date.month}_{p_date.year}":
        return True, 1
    else:
        return False, 0

class Database:
    def __init__(self, table, DB_NAME="railway", DB_USER="postgres", DB_HOST="junction.proxy.rlwy.net", DB_PORT="42906"):
        self.table = table
        self.DB_NAME = DB_NAME
        self.DB_USER = DB_USER
        self.DB_PASSWORD = os.environ.get("PASSWORD")
        self.DB_HOST = DB_HOST
        self.DB_PORT = DB_PORT

        self.conn = psycopg2.connect(database=self.DB_NAME, user=self.DB_USER, password=self.DB_PASSWORD,
                                     host=self.DB_HOST, port=self.DB_PORT)
        
    def create_table(self):
        with self.conn.cursor() as cur:
            cur.execute(f'''
                CREATE TABLE IF NOT EXISTS {self.table} (
                    username VARCHAR PRIMARY KEY,
                    data JSONB
                )
            ''')
        self.conn.commit()

    def insert_data(self, username, data):
        data = json.dumps(data)
        user_data = self.get_data(username)
        streak = get_streak(user_data["latest_quiz"])
        date = datetime.now()
        if streak[0] == True:
            user_data["streak"] += streak[1]
            user_data["lastest_quiz"] = f"{date.day}_{date.month}_{date.year}"
        else:
            user_data["streak"] = 0
        with self.conn.cursor() as cur:
            cur.execute(f'''
                INSERT INTO {self.table} (username, data) VALUES (%s, %s)
                ON CONFLICT (username) DO UPDATE SET data = %s
            ''', (username, data, data))
        self.conn.commit()

    def get_data(self, username):
        with self.conn.cursor() as cur:
            cur.execute(
                f'SELECT data FROM {self.table} WHERE username = %s', (username,))
            result = cur.fetchone()
            if result:
                return result[0]
            else:
                return None
    
    def get_keys(self):
        with self.conn.cursor() as cur:
            cur.execute(f'SELECT username FROM {self.table}')
            return cur.fetchall()
    
    def num_users(self):
        with self.conn.cursor() as cur:
            cur.execute(f'SELECT COUNT(*) FROM {self.table}')
            return cur.fetchone()[0]

    def verify(self, username):
        for user in self.get_keys():
            if username.lower() == user.lower():
                return False
        return True

    def get_items(self):
        with self.conn.cursor() as cur:
            cur.execute(f'SELECT data FROM {self.table}')
            return cur.fetchall()
        
    def check_token(self, username, token):
        if self.get_data(username)["token"] == token:
            return True
        else:
            return False
        
    def check_email(self, email):
        for item in self.get_items():
            if item["email"] == email:
                return False
        return True

class ChatGPT:
    def __init__(self, database):
        self.chatgpt = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.database = database

    def message(self, messages):
        try:
            response = self.chatgpt.chat.completions.create(
                messages=messages,
                model="gpt-3.5-turbo"
            )
            return response
        except Exception as e:
            return None

    '''
    def create_course(self, username, syllabus):
        prompt = (
            'Convert the course syllabus into the following json formatted {"course_name": <>, "course_subject": <MUST BE "english", "social", "economics", "science", "music", "other languages", "maths", or "creatives">, "units": {"unit_name": <>: {"unit_components": {<MUST CONTAIN ALL REQUIRED COMPONENTS>]}}}, the following is the syllabus: ' + syllabus
        )
        
        response = self.message([{"role": "user", "content": prompt}])
        
        if response and response.choices:
            try:
                content = response.choices[0].message.content
                course = json.loads(content)
                course["quizzes"] = {}

                user_data = self.database.get_data(username)
                user_data["courses"][course["course_name"]] = course
                self.database.insert_data(username, user_data)
                return course
            
            except json.JSONDecodeError:
                print("Failed to decode JSON response.")
                return None
        else:
            print("No valid response received.")
            return None
    '''
    
    def generate_question(self, unit, components):
        while True:
            prompt = (
                            'Create a challenging multiple choice question in the following json format {"question": <>, "answers": {1: "<answer A>", 2: "<answer B>", 3:"<answer C>", 4: "<answer D>"}, "correct": "<A, B, C, or D>"}. '
                            + f"The following is the content to test: unit name: {unit}, topics to be tested for: {components}."
                        )

            response = self.message([{"role": "user", "content": prompt}]).choices[0].message.content
            
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                pass
            

    def generate_exam(self, username, course):
        try:
            content = self.database.get_data(username)["courses"][course]
            quiz = []
            for unit in content["units"]:
                for i in range(0, 5):
                    quiz.append(self.generate_question(unit, str(content["units"][unit]['unit_components'])))
            return quiz

        except KeyError:
            return None
        
    def generate_unit_quiz(self, username, course, unit):
        try:
            quiz = []
            for i in range(0, 5):
                quiz.append(self.generate_question(username, course, self.database.get_data(username)["courses"][course]["units"][unit]))
            return quiz
        except KeyError:
            return None

    '''def generate_quizzes(self, username, course, start_epoch, end_epoch):
        days = ceil((end_epoch - start_epoch) / 86400)
        quizzes = {}
        for day in range(days):
            quizzes[day] = self.generate_quiz(username, course)
        
        user_data = self.database.get_data(username)
        user_data["courses"][course]["quizzes"] = quizzes
        print(user_data)
        self.database.insert_data(username, user_data)

        return quizzes'''


database = Database("main")
database.create_table()
'''
tokens = Database("token")
tokens.create_table()'''

chatgpt = ChatGPT(database)

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app, supports_credentials=True)

@app.route("/get_courses", methods=["POST"])
def get_courses():
    """
    Client JSON:
    {
        username: str # the username of the user
        token:str # given token from login
    }
    """
    data = request.get_json(force=True)
    username = data["username"]
    '''
    if not database.check_token(username, token):
        return jsonify({"success": False, "reason": "invalid token"})'''

    return jsonify(database.get_data(username)["courses"])

@app.route("/get_stats", methods=["POST"])
def get_stats():
    """
    Client JSON:
    {
        username: str # the username of the user
        token:str # given token from login
    }
    """
    data = request.get_json(force=True)
    username = data["username"]
    user_data = database.get_data(username)
    '''
    if not database.check_token(username, token):
        return jsonify({"success": False, "reason": "invalid token"})'''

    return jsonify({"correct": user_data["correct"], "solved": user_data["solved"], "streak": user_data["streak"]})


@app.route("/n_users", methods=["GET"])
def n_users():
    try:
        return jsonify({"success": True, "n_users": database.num_users()})
    except Exception:
        return jsonify({"success": False})

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)

    if not ('username' in data and 'password' in data and 'email' in data):
        return jsonify({"success": False, "reason": "Invaild JSON data"})

    username, password, email = [data[i] for i in ["username", "password", "email"]]

    salt = hashlib.sha512(random.randbytes(64)).hexdigest()
    password = hashlib.sha256(bytes(password + salt, 'utf-8')).hexdigest()

    if database.verify(username):
        database.insert_data(username, {"courses": {}, "password": password, "salt": salt, "token": "", "email": email, "streak": 0, "solved": 0, "correct": 0, "latest_quiz": ""})
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "reason": "username or email already exists"})
'''
@app.route("/verify", methods=["GET"])
def verify():
    try:
        token = request.args["code"]
        if token in tokens.get_keys():
            user_data = tokens.get_data(token)
            database.insert_data(user_data["username"], {"courses": {}, "password": user_data["password"], "salt": user_data["salt"], "token": "", "email": user_data["email"]})
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "reason": f"invalid code: {token}"})
    except Exception:
        return jsonify({"success": False})'''

@app.route('/login', methods=["POST"])
def login():
    # GET method should return a login page

    if request.method == "POST":
        data = request.get_json(force=True)

        # Check if data is correct
        if not ('username' in data and 'password' in data):
            return jsonify({"success": False, "reason": "Invaild JSON data"})

        username = data['username']
        user_data = database.get_data(username)

        if user_data['password'] == hashlib.sha256(bytes(data['password'] + user_data['salt'], 'utf-8')).hexdigest():
            token = hashlib.sha512(random.randbytes(64)).hexdigest()

            user_data["token"] = token
            database.insert_data(username, user_data)

            return jsonify({"success": True, "token": token})

        else:
            return jsonify({"success": False, "reason": "Incorrect password!"})

@app.route("/create/course", methods=["POST"])
def create_course():
    data = request.get_json(force=True)
    username, course = [data[i] for i in ["username", "course"]]
    '''
    if not database.check_token(username, token):
        return jsonify({"success": False, "message": "Invalid token"}), 400'''

    user_data = database.get_data(username)
    if course in list(user_data["courses"].keys()):
        return {"success": False, "reason": "course already exists"}
    else:
        user_data["courses"][course] = {"units": {}, "quizzes": {}}
        database.insert_data(username, user_data)
        return jsonify({"success": True})

@app.route("/create/unit", methods=["POST"])
def create_unit():
    data = request.get_json(force=True)

    username, course, unit, lesson = [data[i] for i in ["username", "course", "unit", "lesson"]]
    '''if not database.check_token(username, token):
        return jsonify({"success": False, "reason": "invalid token"})'''
    user_data = database.get_data(username)
    if unit in list(user_data["courses"][course]["units"].keys()):
        return {"success": False, "reason": "unit already exists"}
    else:
        user_data["courses"][course]["units"][unit] = {"unit_components": lesson}
        database.insert_data(username, user_data)
        return jsonify({"success": True})

@app.route("/generate/exam", methods=["POST"])
def generate_exam():
    data = request.get_json(force=True)
    username, course = [data[i] for i in ["username", "course"]]
    '''
    if not database.check_token(username, token):
        return jsonify({"success": False, "reason": "invalid token"})'''
    
    user_data = database.get_data(username)
    quiz = chatgpt.generate_exam(username, course)
    quiz_n = f'Course exam #{len(list(user_data["courses"][course]["quizzes"].keys())) + 1}'
    user_data["courses"][course]["quizzes"][quiz_n] = quiz
    database.insert_data(username, user_data)

    return jsonify({"success": True})


@app.route("/generate/unit", methods=["POST"])
def generate_unit():
    try:
        data = request.get_json(force=True)
        username, course, unit = [data[i] for i in ["username", "course", "unit"]]
        '''
        if not database.check_token(username, token):
            return jsonify({"success": False, "reason": "invalid token"})'''
        user_data = database.get_data(username)
        quiz = chatgpt.generate_unit_quiz(username, course, unit)
        quiz_n = f'Unit quiz #{len(list(user_data["courses"][course]["quizzes"].keys())) + 1}'
        user_data["courses"][course]["quizzes"][quiz_n] = quiz
        database.insert_data(username, user_data)

        return jsonify({"success": True})
    except Exception:
        return jsonify({"success": False})

@app.route("/post_quiz", methods=["POST"])
def post_quiz():
    data = request.get_json(force=True)
    username, correct = data["username"], data["correct"]

    user_data = database.get_data(username)
    user_data["correct"] += correct
    user_data["solved"] += 1

    database.insert_data(username, user_data)

    return {"success": True}

if __name__ == "__main__":
    app.run("10.0.0.250", 3333, threaded=True)
