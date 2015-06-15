# A-Welzijn Notification Service

v1.0.8

### Hoe het te gebruiken

```javascript
"dependencies": {
	"awelzijn-notification-service": "latest"
 }
```
```javascript
var app = angular.module('yourApp', [
	'awelzijn.notificationservice'
]);
```

Deze service dient samen gebruikt te worden met de [notification-callout](https://github.com/A-welzijn/notification-callout) (anders worden de booschappen wel bijgehouden, maar niet getoond)

Je injecteert de service in je controller
```javascript
var controller = function (notificationService) {...}
controller.$inject = ['aWelzijnNotificationService'];
```
Je gebruikt de volgende methodes
```javascript
notificationService.notify("Yes!");
notificationService.warning("Oei!");
notificationService.error("Oeioei!");
```
Bij elke methode kan je 1 string of een array van strings gebruiken
```javascript
notificationService.notify(["Yes!", "Jawadde", "Zalig"]);
```