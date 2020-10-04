import { SET_ERROR, SET_USER } from "./types";
import axios from "axios";

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => 
      dispatch({
        type: SET_ERROR,
        payload: err.response.data
      }));
}