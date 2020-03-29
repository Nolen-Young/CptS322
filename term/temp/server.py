from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'

db = sqlalchemy.SQLAlchemy(app)



class logindata(db.Model):
    id = db.Column(db.Integer)
    username = db.Column(db.String(100), nullable=False, primary_key=True)
    password = db.Column(db.String(100), nullable=False)

class studentdata(db.Model):
    username = db.Column(db.String(100), nullable=False, primary_key=True)
    firstname = db.Column(db.String(100))
    lastname = db.Column(db.String(100))
    wsuid = db.Column(db.String(25))
    email = db.Column(db.String(100))
    phonenumber = db.Column(db.String(100))
    major = db.Column(db.String(100))
    cumgpa = db.Column(db.String(10))
    graddate = db.Column(db.String(100))
    tabefore = db.Column(db.Integer)

class facultydata(db.Model):
    username = db.Column(db.String(100), nullable=False, primary_key=True)
    firstname = db.Column(db.String(100))
    lastname = db.Column(db.String(100))
    wsuid = db.Column(db.String(25))
    email = db.Column(db.String(100))
    phonenumber = db.Column(db.String(100))

class applicationClass(db.Model):
    courseid = db.Column(db.String(10), nullable=False, primary_key=True)
    studentusername = db.Column(db.String(100))
    graderecieved = db.Column(db.String(10))
    semestertaken = db.Column(db.String(10))
    appsubmission = db.Column(db.String(10))
    tapreviously = db.Column(db.Integer)
    appstatus = db.Column(db.String(10))

class course(db.Model):
    courseid = db.Column(db.String(10), primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(500))
    
@app.route('/register', methods=["POST"])
def register():
    data = logindata(**request.json)
    db.session.add(data)
    db.session.commit()
    db.session.refresh(data)

    return jsonify({"status": 1, "data": login_to_obj(data)})

@app.route('/login/<string:username>', methods=["GET"])
def login(username):
    row = logindata.query.filter_by(username=username).first()
    return jsonify({"status": 1, "data": login_to_obj(row)}), 200

@app.route('/updateStudent', methods=["POST"])
def updateStudentInfo():
    data = studentdata(**request.json)
    user = studentdata.query.filter_by(username=data.username).first()
    user.firstname = data.firstname
    user.lastname = data.lastname
    user.wsuid = data.wsuid
    user.email = data.email
    user.phonenumber = data.phonenumber
    user.major = data.major
    user.cumgpa = data.cumgpa
    user.graddate = data.graddate
    user.tabefore = data.tabefore
    #db.session.add(user)
    db.session.commit()
    #db.session.refresh(user)

    return jsonify({"status": 1, "data": student_to_obj(data)})



@app.route('/student', methods=["POST"])
def loadStudentInfo():
	data = studentdata(**request.json)
	#data2 = applicationClass(**request.json)
	
	db.session.add(data)
	db.session.commit()
	db.session.refresh(data)
	
	#db.session.add(data2)
	#db.session.commit()
	#db.session.refresh(data2)

	return jsonify({"status": 1, "data": student_to_obj(data)})

@app.route('/student/<string:username>', methods=["GET"])
def getStudentInfo(username):
    row = studentdata.query.filter_by(username=username).first()
    return jsonify({"status": 1, "data": student_to_obj(row)}), 200
	
	
@app.route('/student/apply', methods=["POST"])
def saveApplication():
    data = applicationClass(**request.json)
	
    user = applicationClass.query.filter_by(studentusername=data.studentusername).first()
    user.courseid = data.courseid
    user.graderecieved = data.graderecieved
    user.semestertaken = data.semestertaken
    user.appsubmission = data.appsubmission
    user.tapreviously = data.tapreviously
    user.appstatus = data.appstatus
	
    db.session.commit()

    return jsonify({"status": 1, "data": application_to_obj(data)})
	
def loadApplications(studentusername):
    rows = applicationClass.query.filter_by(studentusername=studentusername).all()
    return jsonify({"status": 1, "data": loadAppHelper(rows)}), 200
	
def loadAppHelper(rows):
	result = []
	for row in rows:
		result.append(
			application_to_obj(row) # you must call this function to properly format 
		)
	return result
	
def application_to_obj(temp):
    temp = {
            "courseid": temp.courseid,
            "studentusername": temp.studentusername,
            "graderecieved": temp.graderecieved,
            "semestertaken": temp.semestertaken,
            "appsubmission": temp.appsubmission,
            "tapreviously": temp.tapreviously,
            "appstatus": temp.appstatus,
            }

    return temp

def login_to_obj(temp):
    temp = {
            "id": temp.id,
            "username": temp.username,
            "password": temp.password,
            }

    return temp

def student_to_obj(temp):
    temp = {
			"username": temp.username,
			"firstname": temp.firstname,
			"lastname": temp.lastname,
			"wsuid": temp.wsuid,
			"email": temp.email,
			"phonenumber": temp.phonenumber,
			"major": temp.major,
			"cumgpa": temp.cumgpa,
			"graddate": temp.graddate,
			"tabefore": temp.tabefore,
			}

    return temp

def main():
    db.create_all() # creates the tables you've provided
    app.run()       # runs the Flask application

if __name__ == '__main__':
    main()
