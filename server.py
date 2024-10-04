import os, json
import psycopg2
import json
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv() 

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

    def create_course(self, syllabus):
        prompt = (
            "Convert the course syllabus into the following json formatted {'course_name': <>, 'course_subject': <MUST BE 'english', 'social', 'economics', 'science', 'music', 'other languages', 'maths', or 'creatives'>, 'units': [{'unit_name': <>, 'unit_components': [<MUST CONTAIN ALL REQUIRED COMPONENTS>]}]}, the following is the syllabus: " + syllabus
        )
        
        response = self.message([{"role": "user", "content": prompt}])
        
        if response and response.choices:
            try:
                content = response.choices[0].message.content
                course_dict = json.loads(content)
                return course_dict
            except json.JSONDecodeError:
                print("Failed to decode JSON response.")
                return None
        else:
            print("No valid response received.")
            return None
        
    def generate_quiz(self, username, subject):
        user_data = self.database.get_data(username)

database = Database("main")
chatgpt = ChatGPT(database)

app = Flask(__name__)

@app.route('/register', methods=['GET'])
def register():
    username = request.json.get("username")
    if database.verify(username):
        database.insert_data(username, {"courses": {}})

if __name__ == "__main__":
    print(chatgpt.create_course("""B&M Adv
     Human resource management
    a) Introduction to human resource management
    b) Organizational structure
    c) Leadership and management
    d) Motivation and demotivation
    e) Communication
     Finance and Accounts
    a) Introduction to finance
    b) Sources of finance
    c) Costs and revenues
    d) Final accounts
    e) Profitability and liquidity ratio analysis
    f) Cash flow
    g) Investment appraisel
     Marketing
    a) Introduction to marketing
    b) Marketing planning
    c) Market research
    d) The 7 P’s of the marketing mix
     Operations Management
    a) Introduction to operations management
    b) Operations methods
    c) Location
    d) Break-even analysis"""))