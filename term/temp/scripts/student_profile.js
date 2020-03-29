var Student_Profile = (function() {
	// backend running on localhost
	var apiUrl = 'http://localhost:5000';
	
	// register form, set value in start method
	
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
   
    var start = function() {


    };
    

    // PUBLIC METHODS
    return {
        start: start
    };
    
})();