var app = angular.module('myApp', []);

app.controller('MessageListController', function ($scope) {
    var messageList = this;

    var socket = new SockJS('/ws');
    var stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/app/chat', function (data) {
            messageList.messages = JSON.parse(data.body);
            $scope.$apply();

            stompClient.subscribe('/topic/chat', function (data) {
                var message = JSON.parse(data.body);
                messageList.messages.unshift(message);
                $scope.$apply();
            });
        });
    });

    messageList.sendMessage = function () {
        if (messageList.author && messageList.text) {
            var data = {
                author: messageList.author,
                text: messageList.text
            };
            stompClient.send("/app/chat", {}, JSON.stringify(data));
            messageList.text = '';
        }
    };
});