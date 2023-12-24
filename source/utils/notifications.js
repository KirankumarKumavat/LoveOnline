import _ from 'lodash';
import { Alert } from 'react-native';
import { constants } from '../common';

/**
 * Custom Notification Hanler Component
 */
class NotificationHandler {
   constructor() {
      this.pendingAlerts = [];
      this.currentAlert = null;
      this.ready = true;
      this.alert = this.alert.bind(this);
      this.sendAlerts = this.sendAlerts.bind(this);
      this.errors = {
         timedOut: _.debounce(this.timedOut.bind(this), 10000),
         loggedOut: this.loggedOut.bind(this),
         serverDown: _.debounce(this.serverDown.bind(this), 10000),
      };
   }

   /**
    * 
    * @param {*} message 
    * error handling
    */
   error(message) {
      this.alert({ title: "Something went wrong!", message });
   }

   /**
    * server down handling
    */
   serverDown() {
      this.alert({
         title: "Server Error",
         message: "Uh-oh, it looks like we're encountering server errors. We'll be back up soon. Sorry!",
      });
   }

   /**
    * logged out handling
    */
   loggedOut() {
      this.blockNext = true;
      this.alert({
         title: "Not Logged In",
         message: "You need to log in to continue.",
      });
   }

   /**
    * request timeout handling
    */
   timedOut() {
      this.alert({
         title: "What's the hold up?",
         message: "It looks like the request is taking longer than expected. Check your internet connectivity and try again.",
      });
   }

   /**
    * 
    * @param {*} param0 
    * show different alert handling
    */
   alert({ title, message, callback = null, onConfirm = null }) {
      if (message) {
         Alert.alert(title || constants.AppName, message)
      }
   }

   /**
    * 
    * @param {*} result 
    * @returns create alert call back
    */
   createCallback(result) {
      const { blockNext } = this;
      return () => {
         _.attempt(this.currentAlert.callback, result);
         _.attempt(this.currentAlert.onConfirm, result);
         if (blockNext) {
            this.blockNext = false;
            this.pendingAlerts = [];
            this.currentAlert = null;
         }
         this.sendAlerts();
      };
   }

   /**
    * send the alerts
    */
   sendAlerts() {
      const alerts = _.uniqWith(this.pendingAlerts, _.isEqual);
      this.ready = false;
      if (alerts.length) {
         this.currentAlert = alerts.shift();
         this.pendingAlerts = alerts;
         const callbackCancel = _.isFunction(this.currentAlert.callback)
            ? [
               {
                  text: "Cancel",
                  onPress: this.createCallback(false),
               },
            ]
            : [];
         Alert.alert(this.currentAlert.title, this.currentAlert.message || null, [
            ...callbackCancel,
            {
               text: "Okay",
               onPress: this.createCallback(true),
            },
         ]);
      } else {
         this.ready = true;
         this.currentAlert = null;
      }
   }
}

const notifications = new NotificationHandler();

export { NotificationHandler };

export default notifications;
