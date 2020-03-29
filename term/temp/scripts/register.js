var Register = (function() {
	// backend running on localhost
	var apiUrl = 'http://localhost:5000';
	
	// register form, set value in start method
	var register;
	var login;
	var student;
	var faculty;
	
	var applicationTemplate;
	
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
	
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };
	
	// Sends post request for new login information when registering
	var registerHandler = function(e) {
		register.hide();
		login.on('click', '.Register', function(e) {
			login.hide();
			register.show();
		})
		register.on('click', '.submit-input', function(e) {
			e.preventDefault ();
			var info = {};
			info.id = register.find('.status-input').val();
			info.username = register.find('.email-register').val();
			info.password = register.find('.password-register').val();
			var onSuccess = function(data) {
				var studentInfo = {};
				studentInfo.username = info.username;
				var onSuccess = function(data) {
					register.hide();
					login.show();
				};
				var onFailure = function() {
					console.error('error');
				};
				
				makePostRequest('/student', studentInfo, onSuccess, onFailure);
			};
			var onFailure = function() {
				console.error('registration error');
			};
			makePostRequest('/register', info, onSuccess, onFailure); 
		});
	};
	
	var loginHandler = function(e) {
		login.on('click', '.submit-input', function(e) {
			var loginInfo = {};
			loginInfo.username = login.find('.username-input').val();
			loginInfo.password = login.find('.password-input').val();
			var onSuccess = function(data) {
				if (data.data.password == loginInfo.password)
				{
					if (data.data.id == 1)
					{
						//tempName = data.data.username;
						sessionStorage.clear();
						sessionStorage.setItem("tempName", data.data.username);
						document.location.href = "../TeamBBB/student_profile.html";
						//loadStudentInfo(tempName);

						//document.getElementsByClassName("hidden-username").item(0).innerText = tempName;
						//loadStudentInfo(tempName);
					}
					else 
					{
						document.location.href = "../TeamBBB/faculty_profile.html"
					}
				}
				else
				{
					console.error('username or password is incorrect');
				}
					
					
			};
			var onFailure = function() {
				console.error('registration error');
			};
			makeGetRequest('/login/' + loginInfo.username, onSuccess, onFailure);
		});
	};
	
	var saveStudentInfo = function() {
		student.on('click', '.student-submit-input', function(e) {
			var studentInfo = {};
			studentInfo.username = sessionStorage.getItem("tempName");
			studentInfo.firstname = $('.Student').find('.first-name-input').val();
			studentInfo.lastname = $('.Student').find('.last-name-input').val();
			studentInfo.wsuid = $('.Student').find('.wsu-id-input').val();
			studentInfo.email = $('.Student').find('.email-input').val();
			studentInfo.phonenumber = $('.Student').find('.phone-number-input').val();
			studentInfo.major = $('.Student').find('.major-input').val();
			studentInfo.cumgpa = $('.Student').find('.gpa-input').val();
			studentInfo.graddate = $('.Student').find('.grad-date-input').val();
			studentInfo.tabefore = $('.Student').find('.ta-before-input').val();
				
			var onSuccess = function(data) {;
				loadStudentInfo();
			};
				
			var onFailure = function() {
				console.error('information error');
			};
					
					
					
			makePostRequest('/updateStudent', studentInfo, onSuccess, onFailure); 
		});
	};
				
	
	var loadStudentInfo = function() {
		//tempName = document.getElementsByClassName("hidden-username").item(0).innerText = localStorage.getItem("tempName");
		//document.location.href = "../TeamBBB/student_profile.html";
		var onSuccess = function(data) {
			//document.getElementsByClassName("first-name-input").item(0).value = 'zack';
			$('.Student').find('.first-name-input').val(data.data.firstname);
			$('.Student').find('.last-name-input').val(data.data.lastname);
			$('.Student').find('.wsu-id-input').val(data.data.wsuid);
			$('.Student').find('.email-input').val(data.data.email);
			$('.Student').find('.phone-number-input').val(data.data.phonenumber);
			$('.Student').find('.major-input').val(data.data.major);
			$('.Student').find('.gpa-input').val(data.data.cumgpa);
			$('.Student').find('.grad-date-input').val(data.data.graddate);
			$('.Student').find('.ta-before-input').val(data.data.tabefore);
			
			displayApplications();
			/*student.find('.last-name-input').val() = data.data.lastname;
			student.find('.wsu-id-input').val() = data.data.wsuid;
			student.find('.email-input').val() = data.data.input;
			student.find('.phone-number-input').val() = data.data.phonenumber;
			student.find('.major-input').val() = data.data.major;
			student.find('.gpa-input').val() = data.data.cumgpa;
			student.find('.grad-date-input').val() = data.data.graddate;
			student.find('.ta-before-input').val() = data.data.tabefore;*/
		};
		var onFailure = function() {
			console.error('failure to load student information');
		};
		makeGetRequest('/student/' + sessionStorage.getItem("tempName"), onSuccess, onFailure);
	};
	
	var displayApplications = function() {
		var onSuccess = function (data) {
			for (i = 0; i < data.data.length(); i++) {
				insertApp(data.data[i]);
			}
		};
		
		var onFailure = function() {
			console.error('failed to display applications');
		};
		
		makeGetRequest('/student/apply', onSuccess, onFailure);
	};
	
	var insertApp = function(application) {
		var newElem = $(applicationTemplate);
		newElem.find('.course-t').text(application.courseid);
		newElem.find('.grade-t').text(application.graderecieved);
		newElem.find('.year-taken-t').text(application.semestertaken);
		newElem.find('.year-applied-t').text(application.appsubmission);
		newElem.find('.ta-before-t').text(application.tapreviously);
		
		student.append(newElem);
	};
	
	var saveApplicationHandler = function() {
		student.on('click', '.add-course-input', function(e){
			application = {}
			application.studentusername = sessionStorage.getItem("tempName");
			application.courseid = $('.Student').find('.course-number-input').val();
			application.graderecieved = $('.Student').find('.grade-earned-input').val();
			application.semestertaken = $('.Student').find('.year-taken-input').val();
			application.appsubmission = $('.Student').find('.year-applied-input').val();
			application.tapreviously = $('.Student').find('.ta-before-2-input').val();
			application.appstatus = "pending";
		
		
		var onSuccess = function(data) {
			console.error('fuck snoen');
		};
		
		var onFailure = function() {
			console.error('information error');
		};
		
		makePostRequest('/student/apply', application, onSuccess, onFailure); 
		});
	};
	
    var start = function() {
        register = $(".register-page");
		login = $(".login-page");
		student = $(".Student");
		faculty = $(".Faculty");
		register.hide();
		
		//applicationTemplate = $(".Student .Applications .application")[0].outerHTML;
		
        registerHandler();
		loginHandler();
		//document.location.href = "../TeamBBB/student_profile.html";
		loadStudentInfo();
		student = $(".Student");
		saveStudentInfo();
		saveApplicationHandler();
		
		
    };
    

    // PUBLIC METHODS
    return {
        start: start
    };
    
})();