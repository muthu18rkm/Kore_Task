var myApp = angular.module('myApp', []);

myApp.controller('shorternurlController', ['$scope', '$http', function ($scope, $http) {
    loadcaptcha();

    $scope.submit = function () {
        $scope.status = " Generating Short URL Pleace Wait";
        let body = { longurl: document.getElementById('longurl').value.trim() }

        if (!body.longurl) {
            $scope.status = "";
            window.confirm("Enter valid URl and Submit");
        } else {
            $http.post("/shortenurl/createshortenurl", body)
                .then(function successCallback(response) {
                    $scope.status = "";
                    $scope.shortenurl = response.data.link;
                }, function errorCallback(response) {
                    $scope.status = " error " + response.data;
                    window.confirm(response.data);
                })

        }
    }

    $scope.submitcaptcha = function () {
        $scope.captchastatus = "   Verifying Please Wait...";
        $scope.captchvalidation = "";
        let body = {
            captcha: document.getElementById('captcha').value.trim()
        }

        if (!body.captcha) {
            $scope.captchastatus = "";
            window.confirm("Enter Captcha And Submit");
        } else {
            if (body.captcha == $scope.captchavalue) {
                $scope.captchastatus = "Verified Succesfully";
            } else {
                $scope.captchastatus = "Invalid Captcha";
                window.confirm($scope.captchastatus);
            }
        }
    };

    $scope.refresh = function () {
        loadcaptcha();
        document.getElementById('captcha').value = "";
        $scope.captchastatus = "";
    };

    function loadcaptcha() {
        $http.get("/captcha/createcaptch/")
            .then(function successCallback(response) {
                $scope.captchaimage = response.data.image;
                $scope.captchavalue = response.data.value;
            });
    };

}])