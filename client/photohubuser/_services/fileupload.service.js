(function () {
    'use strict';

    angular
        .module('app')
        .factory('FileUploadService', Service);

    function Service($http, $q) {
        var service = {};

        service.UploadFileToUrl = UploadFileToUrl;

        return service;

        function UploadFileToUrl(file, uploadUrl) {
            var fd = new FormData();
            fd.append('file', file);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(handleSuccess, handleError);

            function handleSuccess(res) {
                return res.data;
            }

            function handleError(res) {
                return $q.reject(res.data);
            }
    
        }

    }
})();
