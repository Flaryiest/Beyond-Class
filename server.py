import os, json, psycopg2, time, random
from math import ceil
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import hashlib

load_dotenv() 

DB_HOST = "127.0.0.1"

class Database:
    def __init__(self, table, DB_NAME="postgres", DB_USER="postgres", DB_HOST="127.0.0.1", DB_PORT="5432"):
        self.table = table
        self.DB_NAME = DB_NAME
        self.DB_USER = DB_USER
        self.DB_PASSWORD = os.environ.get("DB_KEY")
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
        with self.conn.cursor() as cur:
            cur.execute(f'''
                INSERT INTO {self.table} (username, data) VALUES (%s, %s)
                ON CONFLICT (username) DO UPDATE SET data = %s
            ''', (username, json.dumps(data), json.dumps(data)))
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
    
    def verify(self, username):
        for user in self.get_keys():
            if username.lower() == user.lower():
                return False
        return True

    def get_items(self):
        with self.conn.cursor() as cur:
            cur.execute(f'SELECT data FROM {self.table}')
            return cur.fetchall()

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
            print(f"Error during API call: {e}")
            return None

    def create_course(self, username, syllabus):
        prompt = (
            'Convert the course syllabus into the following json formatted {"course_name": <>, "course_subject": <MUST BE "english", "social", "economics", "science", "music", "other languages", "maths", or "creatives">, "units": [{"unit_name": <>, "unit_components": [<MUST CONTAIN ALL REQUIRED COMPONENTS>]}]}, the following is the syllabus: ' + syllabus
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
        
    def generate_quiz(self, username, course):
        try:
            content = self.database.get_data(username)["courses"][course]
            quiz = []
            for unit in content["units"]:
                prompt = (
                    "Create a difficult multiple choice question in the following json format {'question': <>, 'answers': ['<answer A>', '<answer B>', '<answer C>', '<answer D>'], 'correct': '<A, B, C, or D>'}. "
                    + f"The following is the content to test: unit name: {unit['unit_name']}, topics to be tested for: {', '.join(unit['unit_components'])}."
                )

                response = self.message([{"role": "user", "content": prompt}]).choices[0].message.content
                
                try:
                    quiz.append(json.loads(response))
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}")
                    print(f"Response content: {response}")

            return quiz

        except KeyError:
            return None


    def generate_quizzes(self, username, course, epoch):
        days = ceil((epoch - time.time()) / 86400)
        quizzes = {}
        for day in range(days):
            quizzes[day] = self.generate_quiz(username, course)
        
        user_data = self.database.get_data(username)
        user_data["courses"][course]["quizzes"] = quizzes
        print(user_data)
        self.database.insert_data(username, user_data)

        return quizzes


database = Database("main", DB_HOST=DB_HOST)
database.create_table()

chatgpt = ChatGPT(database)

app = Flask(__name__)

@app.route("/get_courses/<username>", methods=["GET"])
def get_courses(username):
    courses = []
    user_data = database.get_data(username)["courses"]
    for course in user_data:
        courses.append({"course": course, "subject": user_data[course]["course_subject"]})

    return jsonify(database.get_data(username)["courses"])

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)

    """
    Client JSON Data to send:
    {
        username: str # the username of the user
        password: str # the password of the user. ideally, should also be hashed by the client 
    }
    """

    # Check if the data is correct
    if not ('username' in data and 'password' in data):
        return jsonify({"success": False, "reason": "Invaild JSON data"})
 
    username = data['username']
    password = data['password']

    # Hash the password
    salt = hashlib.sha512(random.randbytes(64)).hexdigest()

    password = hashlib.sha256(bytes(password + salt, 'utf-8')).hexdigest()

    if database.verify(username):
        database.insert_data(username, {"courses": {}, "password": password, "salt": salt})

        return jsonify({"success": True})
    
    else:
        return jsonify({"success": False, "reason": "Username is already registered in the database!"})

@app.route('/login', methods=["POST"])
def login():
    # GET method should return a login page

    if request.method == "POST":
        data = request.get_json(force=True)

        # Check if data is correct
        if not ('username' in data and 'password' in data):
            return jsonify({"success": False, "reason": "Invaild JSON data"})


        userData = database.get_data(username)

        # Hash the password
        password = hashlib.sha256(bytes(data['password'] + userData['salt'], 'utf-8')).hexdigest()

        username = data['username']

        # Verify Password. you should create a function in the DB
        correctPassword = userData['password']

        if correctPassword == password:
            """some login thing like a session token or wutever."""

            return jsonify({"success": True, })

        else:
            return jsonify({"success": False, "reason": "Incorrect password!"})



if __name__ == "__main__":
    app.run("10.0.0.250", 3333)
