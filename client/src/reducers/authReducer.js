import { SET_USER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state=initialState, action){

  switch(action.type){
    case SET_USER:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }
}