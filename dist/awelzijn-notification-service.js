'use strict';
(function (module) {
  try {
    module = angular.module('awelzijn.notificationservice');
  } catch (e) {
    module = angular.module('awelzijn.notificationservice', ['$rootScope']);
  }
  module.factory('aWelzijnNotificationService', [function ($rootScope) {
    function _createErrorMessages(msg, code, url) {
      var errors = [];
      if (msg && msg.error && msg.error.messages) {
        angular.forEach(msg.error.messages, function (message) {
          errors.push(message);
        });
      } else if (msg && msg.listOfSerializableError) {
        for (var propName in msg.listOfSerializableError) {
          angular.forEach(msg.listOfSerializableError[propName], function (message) {
            errors.push(message);
          });
        }
      } else if (code == 404) {
        errors.push("Er wordt een URL gebruikt die niet wordt gevonden in de API.");
      }
      else {
        errors.push("Er is een onbekende fout opgetreden");
      }
      _error(errors);
    };

    function _notify(msg) {
      var messages = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          messages.push({ message: message, timestamp: new Date() });
        })
      } else {
        messages.push({ message: msg, timestamp: new Date() });
      }

      $rootScope.errors = [];
      $rootScope.warnings = [];
      $rootScope.messages = messages;
    };

    function _error(msg) {
      var errors = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          errors.push({ title: "Let op!", message: message, timestamp: new Date() });
        })
      } else {
        errors.push({ message: msg, timestamp: new Date() });
      }

      $rootScope.messages = [];
      $rootScope.warnings = [];
      $rootScope.errors = errors;
    };

    function _warning(msg) {
      var warnings = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          warnings.push({ message: message, timestamp: new Date() });
        })
      } else {
        warnings.push({ message: msg, timestamp: new Date() });
      }

      $rootScope.messages = [];
      $rootScope.errors = [];
      $rootScope.warnings = warnings;
    };

    return {
      createErrorMessages: _createErrorMessages,
      notify: _notify,
      error: _error,
      warning: _warning
    };
  }]);
})();
;