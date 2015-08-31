'use strict';
(function (module) {
    try {
        module = angular.module('awelzijn.notificationservice');
    } catch (e) {
        module = angular.module('awelzijn.notificationservice', []);
    }
    module.factory('aWelzijnNotificationService', ['$rootScope', function ($rootScope) {
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

        // NOTIFICATION
        function _notify(msg) {
            var messages = [];
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    messages.push({ message: message, timestamp: new Date() });
                })
            } else {
                messages.push({ message: msg, timestamp: new Date() });
            }

            _clear();
            $rootScope.messages = messages;
        };

        function _addNotification(msg) {
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    $rootScope.messages.push({ message: message, timestamp: new Date() });
                })
            } else {
                $rootScope.messages.push({ message: msg, timestamp: new Date() });
            }
        };

        // ERROR
        function _error(msg) {
            var errors = [];
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    errors.push({ title: "Let op!", message: message, timestamp: new Date(), dismissible: false });
                })
            } else {
                errors.push({ message: msg, timestamp: new Date(), dismissible: false });
            }

            _clear();
            $rootScope.errors = errors;
        };

        function _addError(msg, dismissible) {
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    $rootScope.errors.push({ message: message, timestamp: new Date(), dismissible: dismissible });
                })
            } else {
                $rootScope.errors.push({ message: msg, timestamp: new Date(), dismissible: dismissible });
            }
        };

        // WARNING
        function _warning(msg) {
            var warnings = [];
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    warnings.push({ message: message, timestamp: new Date() });
                })
            } else {
                warnings.push({ message: msg, timestamp: new Date() });
            }

            _clear();
            $rootScope.warnings = warnings;
        };

        function _addWarning(msg) {
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    $rootScope.warnings.push({ message: message, timestamp: new Date() });
                })
            } else {
                $rootScope.warnings.push({ message: msg, timestamp: new Date() });
            }
        };

        // DEFAULT MESSAGE
        function _message(msg) {
            var messages = [];
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    messages.push({ message: message, timestamp: new Date() });
                })
            } else {
                messages.push({ message: msg, timestamp: new Date() });
            }

            _clear();
            $rootScope.info = messages;
        };

        function _addMessage(msg) {
            if (msg && msg.constructor === Array) {
                angular.forEach(msg, function (message) {
                    $rootScope.info.push({ message: message, timestamp: new Date() });
                })
            } else {
                $rootScope.info.push({message: msg, timestamp: new Date() });
            }
        };

        function _clearNotifications() {
            $rootScope.messages = [];
        };

        function _clearErrors() {
            $rootScope.errors = [];
        };

        function _clearWarnings() {
            $rootScope.warnings = [];
        };

        function _clearMessages() {
            $rootScope.info = [];
        };

        function _clear() {
            _clearNotifications();
            _clearErrors();
            _clearWarnings();
            _clearMessages();
        };

        _init();

        function _init() {
            _clear();

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                _clear();
            });
        }

        return {
            createErrorMessages: _createErrorMessages,
            notify: _notify,
            addNotification: _addNotification,
            error: _error,
            addError: _addError,
            warning: _warning,
            addWarning: _addWarning,
            message: _message,
            addMessage: _addMessage,
            clear: _clear,
            clearNotifications: _clearNotifications,
            clearErrors: _clearErrors,
            clearWarnings: _clearWarnings,
            clearMessages: _clearMessages
        };
    }]);
})();
