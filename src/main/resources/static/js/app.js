var app = angular.module('myApp', ['ngCookies']);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13 && event.ctrlKey === true) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.controller('MessageListController', function ($scope, $cookieStore) {
    var messageList = this;
    messageList.username = $cookieStore.get('username');

    if (messageList.username) {
        messageList.author = messageList.username;
        connect();
    }

    function connect() {
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
    }

    messageList.login = function () {
        messageList.username = messageList.author;
        $cookieStore.put('username', messageList.author);
        connect();
    };
});