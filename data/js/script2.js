var app = angular.module('home',[]);

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
	socket.emit('user name',user_name, is_admin); // sending user name to the server


    socket.on('user entrance',function(data,my_id){
    	//checking the user id
    	if($scope.my_id==null){
    	    $scope.my_id=my_id;
    	    $scope.date=user_name;
    	}
    	$scope.user_show=data;
		$scope.$apply(); 		
	}); 	




	//function to send messages.
	$scope.send_msg = function($event){
	    var keyCode = $event.which || $event.keyCode;
    	if (keyCode === 13) { 
	    	var inputs=$('ul.user input:checked');
	    	$.each(inputs,function(i,el){
	    		var data_server={
		    		id:el.value,
		    		msg:$scope.msg_text,
		    		date:user_name
		    	};
		    	console.log(data_server)
		        socket.emit('send msg',data_server);
	    	})
	    	$scope.msg_text='';
        } 
	};

	//to highlight selected row
	$scope.clicked_highlight = function(id,name){
		$scope.clicked=id;
		$scope.selected_id=id;
		$scope.selected_name=name;
	    // $scope.$apply(); 
	};
	
	//on exit updating the List od users
	socket.on('exit',function(data){
		$scope.user_show=data;
	    $scope.$apply(); 
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

        var Notify = window.Notify.default;

        function doNotification () {
            var myNotification = new Notify(data.name, {
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