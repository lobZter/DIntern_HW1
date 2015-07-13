var app = angular.module('myApp', []);

app.factory('socket', function(){
    return io.connect();
});

app.controller('myCtrl', function($scope, $http, socket){
    $scope.msgs = [];

    $scope.sendMsg = function() {
        socket.emit('send msg', $scope.chat.msg);
        $scope.chat.msg = '';
    };

    socket.on('connect', function() {
        socket.emit('add user', getUrlParameter('username'));
    });

    socket.on('get history', function(data) {
		for(var index in data)
			$scope.msgs.push(data[index]);
        $scope.$digest();
		$('#chatWrap').scrollTop($('#chatWrap').prop('scrollHeight'));
    });

    socket.on('get msg', function(data) {
        $scope.msgs.push(data);
        $scope.$digest();
		$('#chatWrap').scrollTop($('#chatWrap').prop('scrollHeight'));
    });
    
    $scope.select1 = function() {
        $http.get("http://sandbox.api.simsimi.com/" + 
            "request.p?key=10f4885e-cf7b-4b3f-a9c3-21c8529d0a16&lc=zh&ft=1.0&text=" +
            $scope.msgs[($scope.msgs).length-1].message
        )
        .success(function(response) {
            console.log(response);
        });
    };
});

app.controller('simsimiCtrl', function($scope, $http) {
    
});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
