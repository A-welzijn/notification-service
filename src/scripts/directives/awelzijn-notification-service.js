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
          messages.push({ type: "success", message: message, timestamp: new Date(), dismissible : true, actions: [] });
        })
      } else {
        messages.push({ type: "success", message: msg, timestamp: new Date(), dismissible : true, actions: [] });
      }

	  _clear();
      $rootScope.notifications = messages;
    };
	
	function _addNotification(msg) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.notifications.push({ type: "success", message: message, timestamp: new Date(), dismissible : true, actions: [] });
        })
      } else {
        $rootScope.notifications.push({ type: "success", message: msg, timestamp: new Date(), dismissible : true, actions: [] });
      }
    };
	
	// ERROR
    function _error(msg) {
      var errors = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          errors.push({ type: "error", title: "Let op!", message: message, timestamp: new Date(), dismissible : false, actions: [] });
        })
      } else {
        errors.push({ type: "error", message: msg, timestamp: new Date(), dismissible : false, actions: [] });
      }
	  
	  _clear();
      $rootScope.errors = errors;
    };
	
	function _addError(msg, dismissible) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.errors.push({ type: "error", title: "Let op!", message: message, timestamp: new Date(), dismissible : dismissible, actions: [] });
        })
      } else {
        $rootScope.errors.push({ type: "error", title: "Let op!", message: msg, timestamp: new Date(), dismissible : dismissible, actions: [] });
      }
    };
	
	// WARNING
    function _warning(msg) {
      var warnings = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          warnings.push({ type: "warning", message: message, timestamp: new Date(), dismissible : true, actions: [] });
        })
      } else {
        warnings.push({ type: "warning", message: msg, timestamp: new Date(), dismissible : true, actions: [] });
      }
	
	  _clear();
      $rootScope.warnings = warnings;
    };
	
	function _addWarning(msg) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.warnings.push({ type: "warning", message: message, timestamp: new Date(), dismissible : true, actions: [] });
        })
      } else {
        $rootScope.warnings.push({ type: "warning", message: msg, timestamp: new Date(), dismissible : true, actions: [] });
      }
    };
	
	// DEFAULT MESSAGE
    function _message(msg) {
      var messages = [];
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          messages.push({ type: "message", message: message, timestamp: new Date(), dismissible : true, actions: [] });
        })
      } else {
        messages.push({ type: "message", message: msg, timestamp: new Date(), dismissible : true, actions: [] });
      }
	  
	  _clear();
      $rootScope.messages = messages;
    };
	
	function _addMessage(msg) {
      if (msg && msg.constructor === Array) {
        angular.forEach(msg, function (message) {
          $rootScope.messages.push({ type: "message", message: message, timestamp: new Date(), dismissible : true, actions: [] });
        })
      } else {
        $rootScope.messages.push({ type: "message", title: "test", message: msg, timestamp: new Date(), dismissible : true, actions: [] });
      }
    };
	
	// CLEAR
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
	
	
	// FUNCTIONS WITH CALLOUT OBJECTS
	/*
		{ 
		type: "error",	// warning, error, message, info
		title: "Let op!", 
		message: "inhoud", 
		dismissible : dismissible,
		actions : [ { name: "", callback: callbackFn, callbackParams: {} } ]	-> callbackFn must have 2 params: callOut itself and callbackParams
		}
	*/
	function _addCallOut(callOut) {
      if (callOut) {
		  
		  callOut.timestamp = new Date();
		  
		  switch(callOut.type){
			case "error":
				$rootScope.errors.push(callOut);
				break;
			case "warning":
				$rootScope.warnings.push(callOut);
				break;
			case "success":
				$rootScope.notifications.push(callOut);
				break;
			case "message":
				$rootScope.messages.push(callOut);
				break;
			default: break;
		  }
      }
    };
	
  // remove call-out object from collection - index is determined by indexOf(callOut)
	function _removeCallOut(callOut) {

		var index = -1;
		
		if(callOut){
			
			switch(callOut.type){
				case "error":
					index = $rootScope.errors.indexOf(callOut);
					if( index >= 0 && $rootScope.errors.length > index ) $rootScope.errors.splice(index, 1);
					break;
				case "warning":
					index = $rootScope.warnings.indexOf(callOut);
					if( index >= 0 && $rootScope.warnings.length > index ) $rootScope.warnings.splice(index, 1);
					break;
				case "success":
					index = $rootScope.notifications.indexOf(callOut);
					if( index >= 0 && $rootScope.notifications.length > index ) $rootScope.notifications.splice(index, 1);
					break;
				case "message":
					index = $rootScope.messages.indexOf(callOut);
					if( index >= 0 && $rootScope.messages.length > index ) $rootScope.messages.splice(index, 1);
					break;
				default: break;
			}
		}
	};

  // remove call-out object at a specified index from a collection
	function _removeCallOutByIndex(type, index) {
		
		switch(type){
			case "error":
				if( index >= 0 && $rootScope.errors.length > index ) $rootScope.errors.splice(index, 1);
				break;
			case "warning":
				if( index >= 0 && $rootScope.warnings.length > index ) $rootScope.warnings.splice(index, 1);
				break;
			case "success":
				if( index >= 0 && $rootScope.notifications.length > index ) $rootScope.notifications.splice(index, 1);
				break;
			case "message":
				if( index >= 0 && $rootScope.messages.length > index ) $rootScope.messages.splice(index, 1);
				break;
			default: break;
		}
	};
	
	// cache the current call-out collections within this service
	function _cacheCallOuts() {
		_cache.notifications = _getNotifications();
		_cache.errors = _getErrors();
		_cache.warnings = _getWarnings();
		_cache.messages = _getMessages();
		
		_callOutsCached = true;
    };
	
	// reset the current call-out collections from cache
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
	  addCallOut: _addCallOut,
	  removeCallOut: _removeCallOut,
	  removeCallOutByIndex: _removeCallOutByIndex,
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