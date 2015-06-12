# A-Welzijn Notification Callouts

v1.0.5

### Hoe het te gebruiken

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