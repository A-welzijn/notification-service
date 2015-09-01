'use strict';
(function (module) {
  try {
    module = angular.module('awelzijn.notificationservice');
  } catch (e) {
    module = angular.module('awelzijn.notificationservice', []);
  }
  module.factory('aWelzijnNotificationService', ['$rootScope', function ($rootScope) {
	
	var _callOutsCached = false;
	var _cache = { errors: [], warnings: [], notifications: [], messages: []};
	
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
          messages.push({ type: "success", message: message, timestamp: new Date() });
        })
      } else {
        messages.push({ type: "success", message: msg, timestamp: new Date() });
      }

	  _clear();
      $rootScope.notifications = messages;
    };
	
	function _addNotification(msg) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.notifications.push({ type: "success", message: message, timestamp: new Date() });
        })
      } else {
        $rootScope.notifications.push({ type: "success", message: msg, timestamp: new Date() });
      }
    };
	
	// ERROR
    function _error(msg) {
      var errors = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          errors.push({ type: "error", title: "Let op!", message: message, timestamp: new Date(), dismissible : false });
        })
      } else {
        errors.push({ type: "error", message: msg, timestamp: new Date(), dismissible : false });
      }
	  
	  _clear();
      $rootScope.errors = errors;
    };
	
	function _addError(msg, dismissible) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.errors.push({ type: "error", title: "Let op!", message: message, timestamp: new Date(), dismissible : dismissible });
        })
      } else {
        $rootScope.errors.push({ type: "error", title: "Let op!", message: msg, timestamp: new Date(), dismissible : dismissible });
      }
    };

	// WARNING
    function _warning(msg) {
      var warnings = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          warnings.push({ type: "warning", message: message, timestamp: new Date() });
        })
      } else {
        warnings.push({ type: "warning", message: msg, timestamp: new Date() });
      }
	
	  _clear();
      $rootScope.warnings = warnings;
    };
	
	function _addWarning(msg) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.warnings.push({ type: "warning", message: message, timestamp: new Date() });
        })
      } else {
        $rootScope.warnings.push({ type: "warning", message: msg, timestamp: new Date() });
      }
    };
	
	// DEFAULT MESSAGE
    function _message(msg) {
      var messages = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          messages.push({ type: "message", message: message, timestamp: new Date() });
        })
      } else {
        messages.push({ type: "message", message: msg, timestamp: new Date() });
      }
	  
	  _clear();
      $rootScope.messages = messages;
    };
	
	function _addMessage(msg) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.messages.push({ type: "message", message: message, timestamp: new Date() });
        })
      } else {
        $rootScope.messages.push({ type: "message", title: "test", message: msg, timestamp: new Date()});
      }
    };
	
	function _clearNotifications() {
      $rootScope.notifications = [];
    };
	
	function _clearErrors() {
      $rootScope.errors = [];
    };
	
	function _clearWarnings() {
      $rootScope.warnings = [];
    };
	
	function _clearMessages() {
      $rootScope.messages = [];
    };
    
    function _clear() {
      _clearNotifications();
      _clearErrors();
      _clearWarnings();
      _clearMessages();
	  
    };
	
	function _removeMessage(type, index) {
		
		var collection = [];
		
		switch(type){
			case "error":
				collection = $rootScope.errors;
				break;
			case "warning":
				collection = $rootScope.warnings;
				break;
			case "success":
				collection = $rootScope.notifications;
				break;
			case "message":
				collection = $rootScope.messages;
				break;
			default: break;
		}
		
		if( index >= 0 && collection.length > index ) collection.splice(index, 1);
	};
	
	// bewaar de huidige meldingen
	function _cacheCallOuts() {
		_cache.notifications = _getNotifications();
		_cache.errors = _getErrors();
		_cache.warnings = _getWarnings();
		_cache.messages = _getMessages();
		
		_callOutsCached = true;
    };
	
	// herzet de huidige meldingen vanuit cache
	function _restoreCallOuts() {
		$rootScope.notifications = _cache.notifications;
		$rootScope.errors = _cache.errors;
		$rootScope.warnings = _cache.warnings;
		$rootScope.messages = _cache.messages;
    };
	
	function _clearCache()	{
		_cache = { errors: [], warnings: [], notifications: [], messages: []};
		_callOutsCached = false;
	}
	
	function _getNotifications() {
		if(angular.isDefined($rootScope.notifications)) return $rootScope.notifications;
		else return [];
	};
	
	function _getErrors() {
		if(angular.isDefined($rootScope.errors)) return $rootScope.errors;
		else return [];
	};
	
	function _getWarnings() {
		if(angular.isDefined($rootScope.warnings)) return $rootScope.warnings;
		else return [];
	};
	
	function _getMessages() {
		if(angular.isDefined($rootScope.messages)) return $rootScope.messages;
		else return [];
	};
	
	
	_init();
	
	function _init(){
		_clear();
		
		// alle meldingen pas leegmaken na succes van $stateChange; dit geeft de kans om voordien nog eventueel de meldingen op te slaan in $stateChangeStart event
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
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
	  clearCache: _clearCache,
	  clearNotifications: _clearNotifications,
	  clearErrors: _clearErrors,
	  clearWarnings: _clearWarnings,
	  clearMessages: _clearMessages,
	  removeMessage: _removeMessage,
	  getNotifications: _getNotifications,
	  getErrors : _getErrors,
	  getWarnings: _getWarnings,
	  getMessages: _getMessages,
	  cacheCallOuts: _cacheCallOuts,
	  restoreCallOuts: _restoreCallOuts,
	  callOutsCached : _callOutsCached
    };
  }]);
})();;