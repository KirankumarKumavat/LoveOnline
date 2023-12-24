import _ from 'lodash';

import io from 'socket.io-client';
import { chatGetNewMessage, chatLoadUserList } from '../redux/action';
import { Store } from '../redux/reduxStore';
import { chatListRef } from '../screens/chat/Chat';
import { chatWindowRef } from '../screens/chat/ChatWindow';
import apiConfigs from './apiConfig';
import r, { getToken } from './Request';

/**
 * Socket class for live connection and chat module
 */
class Socket {
   /**
   * initializeSocket while we go into chat screen.
   */
   static initializeSocket = async () => {
      // initialize socket
      if (!this.socket) {
         this.socket = io(apiConfigs.LIVE_SERVER_SOCKET_URL, { transports: ['websocket'], jsonp: false, });
         // this.socket = io(settings[getEnv()].socketEndPoint, { transports: ['websocket'], jsonp: false });
         this.socket.on('connect', () => {
            console.log("Socket is connected");
            return true;
         });
         this.socket.on('response', response => {
            this.filterSocketMethods(response)
         });
         this.socket.on("connect_error", (error) => {
            console.log("Socket is connect_error", error);
            // ...
            return false;
         });
         this.socket.on("connect_failed", (error) => {
            console.log("Socket is connect_error", error);
            // ...
            return false;
         });
         this.socket.on('disconnect', evt => {
            console.log("Socket is disconnected");
            return false;
         });
      }
   }

   /**action for send request to connected socket */
   static sendRequest = async (methodName, param = {}) => {

      let params = {
         headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            // "Content-Type": "multipart/form-data",
            'android_app_version': apiConfigs.android_app_version,
            "device_id": apiConfigs.device_id,
            "device_type": apiConfigs.device_type,
            "os": apiConfigs.os,
            "app_version": apiConfigs.app_version,
            "language": apiConfigs.language,
            "auth_token": await getToken(),
         },
         body: { ...param },
      }
      if (!this.socket) {
         await this.initializeSocket();
      }
      console.log("Socket Params-->", params, methodName);
      const resp = await new Promise((resolve, reject) => {
         this.socket.emit(methodName, params, async (response) => {
            console.log("Socket Response--->", response);
            const responseObj = await this.validateSocketResponse(response, methodName, param);
            if (responseObj && responseObj.code == 1) {
               resolve(responseObj);
            }
            else {
               reject();
            }
         });
      });
      return resp;
   }

   /**
  * validates response  
  * handles auth token expire, user blocked. etc..
  * returns false or response
  */
   static validateSocketResponse = async (response, methodName = null, param = {}) => {
      if (response.code == 401) {
         const result = await r.post('refreshToken');
         await r.setToken(result.data.auth_token);
         if (methodName) return await this.sendRequest(methodName, param);
         // else return false;
      }
      else if (response.code == 406) {
         const method_name = 'loginChat';
         await this.sendRequest(method_name, { receiver_id: param.receiver_id });
         return await this.sendRequest(methodName, param);
      }
      else if (response.code == 1) {
         return response;
      }
      else {
         alert(response.message);
         return false;
      }
   }

   /**
 * call while get direct emit from server
 * ex: messageReceived method
 * calling gotNewMessage action for add message directly in redux
 */
   static filterSocketMethods = async (response) => {
      const responseObj = await this.validateSocketResponse(response);
      if (responseObj.code == 1) {
         if (responseObj.method_name === 'messageReceived') {
            const message = responseObj.data;
            Store.dispatch(chatGetNewMessage({ message }));
            if (chatWindowRef) {
               chatWindowRef.onlySendData()
            }
         }
         else if (responseObj.method_name === 'getChatUsers') {
            const users = responseObj.data;
            Store.dispatch(chatLoadUserList({
               users,
            }));
         }
         else if (responseObj.method_name === "editAppStatus") {
            if (chatWindowRef) {
               await chatWindowRef.getOnlineStatus();
               await chatWindowRef.onlySendData();
            }
            if (chatListRef) {
               await chatListRef.getUserList();
            }
         }
         else if (responseObj.method_name === "getMessages") {
            // else if (responseObj.method_name === "loginChat") {
            if (chatWindowRef) {
               await chatWindowRef.onlySendData();
            }
         }
         else if (responseObj.method_name == "typing") {
            if (chatWindowRef && responseObj.data) {
               chatWindowRef.setTypingValue(responseObj.data);
            }
            if (chatListRef) {
               await chatListRef.getUserList();
            }
         }
         else if (responseObj.method_name == "getMatchStatus") {
            if (chatWindowRef) {
               chatWindowRef.getMatchedStatus();
            }
            if (chatListRef) {
               await chatListRef.getUserList();
            }
         }
      }
   }

   /**
 * disconnectSocket while you don't need it.
 */
   static disconnectSocket = () => {
      this.socket.close();
      // this.socket.disconnect();
      this.socket = undefined;
   }

}
export default Socket;