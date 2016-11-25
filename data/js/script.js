var app = angular.module('home',[]);
var Notify = window.Notify.default;
var clients;
function onPermissionGranted () {
    console.log('Permission has been granted by the user');
}

function onPermissionDenied () {
    console.warn('Permission has been denied by the user');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    var options= {
	  "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
	  "icon": "images/ccard.png",
	  "vibrate": [200, 100, 200, 100, 200, 100, 400],
	  "tag": "request",
	  "actions": [
	    { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
	    { "action": "no", "title": "No", "icon": "images/no.png" }
	  ]
	}
    registration.showNotification(title, options);

  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}else{
	console.log('Service workers aren\'t supported in this browser.')
}

app.controller('home', function ($scope) {
	var user_name=moment().format(); //getting user name

	var socket = io();
	$scope.clicked=null;
	$scope.selected_id='nobody';
	$scope.selected_name='nobody';
	$scope.msgs=null;
	$scope.my_id=null;
	$scope.date=null;
	$scope.is_msg_show=false;

	var is_admin=jQuery('body').hasClass('admin');


    socket.on('user entrance',function(data,my_id){
    	//checking the user id
    	if($scope.my_id==null){
    	    $scope.my_id=my_id;
    	    $scope.date=user_name;
    	}
    	$scope.user_show=data;
		$scope.$apply(); 
		if(!is_admin){
			database.ref('/').set({clients: data});
		}
	}); 	

    if (!is_admin && Notify.needsPermission && Notify.isSupported()) {
    	console.log(Notify.needsPermission,Notify.isSupported())
		Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }

    // Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyDPPFIhwf58Rx1oa44jXwHHLVkcMHb94WU",
	    authDomain: "notifications-6c4fb.firebaseapp.com",
	    databaseURL: "https://notifications-6c4fb.firebaseio.com",
	    storageBucket: "notifications-6c4fb.appspot.com",
	    messagingSenderId: "31726037008"
	  };
	  firebase.initializeApp(config);
	  var database = firebase.database();


	  firebase.database().ref('/').once('value').then(function(snapshot) {
	  	if(snapshot.val()) clients=snapshot.val().clients;
		if(typeof(clients)=='undefined'){
			// database.ref('/').set({clients: []});
			clients=[]
		}
		socket.emit('user name',user_name, is_admin); // sending user name to the server

	  });


	//function to send messages.
	$scope.send_msg = function($event){
		console.log('send_msg')
	    var keyCode = $event.which || $event.keyCode;
    	if (keyCode === 13) { 
	    	var inputs=$('ul.user input:checked');
	    	$.each(inputs,function(i,el){
	    		var data_server={
		    		id:el.value.split('|')[0],
		    		msg:$scope.msg_text,
		    		date:el.value.split('|')[1]
		    	};
		    	console.log(data_server)
		        socket.emit('send msg',data_server);
	    	})
	    	$scope.msg_text='';
        } 
	};

	
	//on exit updating the List od users
	socket.on('exit',function(data){
		$scope.user_show=data;
	    $scope.$apply(); 
	    if(!is_admin){
			database.ref('/').set({clients: data});
		}
	});

	//displaying the messages.
	socket.on('get msg',function(data){
		console.log('get msg',data)
		$scope.msgs=data;
		$scope.is_msg_show=true;
		$scope.$apply(); 

        function onShowNotification () {
            console.log('notification is shown!');
        }

        function onCloseNotification () {
            console.log('notification is closed!');
        }

        function onClickNotification () {
            console.log('notification was clicked!');
        }

        function onErrorNotification () {
            console.error('Error showing notification. You may need to request permission.');
        }

        function onPermissionGranted () {
		    console.log('Permission has been granted by the user');
		    doNotification();
		}

		function onPermissionDenied () {
		    console.warn('Permission has been denied by the user');
		}

       
        function doNotification () {
            var myNotification = new Notify(data.date, {
                body: data.msg,
                tag: 'ID: '+ data.id,
                icon: 'http://image.freepik.com/iconos-gratis/cara-del-leon_318-74221.jpg',
                notifyShow: onShowNotification,
                notifyClose: onCloseNotification,
                notifyClick: onClickNotification,
                notifyError: onErrorNotification,
                timeout: 4
            });

            myNotification.show();
        }


        if (!Notify.needsPermission) {
            doNotification();
        } else if (Notify.isSupported()) {
            Notify.requestPermission(onPermissionGranted, onPermissionDenied);
        }

	});


});

 