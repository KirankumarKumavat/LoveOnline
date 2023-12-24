import { subscribtionActionTypes } from "../types";
/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   subscribtionProductList: [],
   subscribtionPlanListFromIAP: [],
   selectedPlanDetails: {},
   selectedPlanIndex: null,
}

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for User Subscription module
 */
const subscribtionReducer = (state, action) => {
   switch (action.type) {
      case subscribtionActionTypes.SUBSCRIBTION_REQUEST:
         return {
            ...state,
            loading: true,
         }
      case subscribtionActionTypes.SUBSCRIBTION_SUCCESS:
         return {
            ...state,
            loading: false,
         }
      case subscribtionActionTypes.SUBSCRIBTION_FAILURE:
         return {
            ...state,
            loading: false,
         }
      case subscribtionActionTypes.SUBSCRIBTION_LOAD_PRODUCT_LIST:
         return {
            ...state,
            loading: false,
            subscribtionProductList: action.payload.subscribtionProductList,
         }
      case subscribtionActionTypes.SUBSCRIBTION_LOAD_IAP_PRDUCT_LIST:
         return {
            ...state,
            loading: false,
            subscribtionPlanListFromIAP: action.payload.subscribtionPlanListFromIAP,
         }
      case subscribtionActionTypes.SUBSCRIBTION_STORE_SELECTED_PLAN_DETAILS:
         return {
            ...state,
            loading: false,
            selectedPlanDetails: action.payload.selectedPlanDetails
         }
      case subscribtionActionTypes.SUBSCRIBTION_SELECT_PLAN_INDEX:
         return {
            ...state,
            selectedPlanIndex: action.payload.selectedPlanIndex
         }
      case subscribtionActionTypes.SUBSCRIBTION_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default subscribtionReducer;