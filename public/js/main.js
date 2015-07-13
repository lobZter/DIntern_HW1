var app = angular.module('myApp', []);

app.factory('socket', function(){
    return io.connect();
});

app.controller('myCtrl', function($scope, socket){
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
    });

    socket.on('get msg', function(data) {
        $scope.msgs.push(data);
        $scope.$digest();
    });
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

//http://sandbox.api.simsimi.com/request.p?key=10f4885e-cf7b-4b3f-a9c3-21c8529d0a16&lc=en&ft=1.0&text=hi