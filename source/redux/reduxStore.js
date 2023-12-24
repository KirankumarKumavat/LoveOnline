import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import loginReducer from './reducers/loginReducer';
import signupReducer from './reducers/signupReducer';
import profileSetupReducer from './reducers/profileSetupReducer';
import settingsProfileReducer from './reducers/settingsProfileReducer';
import forgotPasswordReducer from './reducers/forgotPasswordReducer';
import userProfileReducer from './reducers/userProfileReducer';
import exploreReducer from './reducers/exploreReducer';
import filterRedcer from './reducers/filterRedcer';
import likeReducer from './reducers/likeReducer';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import chatReducer from './reducers/chatReducer';
import matchedReducer from './reducers/matchedReducers';
import notificationReducer from './reducers/notificationReducer';
import notificationPermissionReducer from './reducers/notificationPermissionReducer';
import subscribtionReducer from './reducers/subscribtionReducer';

/**
 * Root Reducer which combine all reducers of app which are regiestered
 */

const rootReducer = combineReducers({
   loginState: loginReducer,
   signupState: signupReducer,
   profileSetupState: profileSetupReducer,
   settingsProfileState: settingsProfileReducer,
   forgotPasswordState: forgotPasswordReducer,
   userProfileState: userProfileReducer,
   exploreState: exploreReducer,
   filterState: filterRedcer,
   likeState: likeReducer,
   chatState: chatReducer,
   matchesState: matchedReducer,
   notificationState: notificationReducer,
   notificationPermissionState: notificationPermissionReducer,
   subscribtionState: subscribtionReducer
})

/**
 * Main Root store to maintain and store data for User
 */

export const Store = createStore(
   persistReducer({
      key: 'root',
      storage: AsyncStorage,
      blacklist: ['loginState', 'signupState', 'profileSetupState'],
      stateReconciler: autoMergeLevel2,
      version: 0,
   },
      rootReducer
   ),
   __DEV__ ? applyMiddleware(thunk, logger) : applyMiddleware(thunk),
);

export default rootReducer;

/**
 * Create The Persist Store
 */
export const persister = persistStore(Store);

/**
 * Redux store.
 */
export const store = createStore(
   rootReducer,
   __DEV__ ? applyMiddleware(thunk, logger) : applyMiddleware(thunk),
);