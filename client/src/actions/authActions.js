import { SET_USER } from "./types"

export const registerUser = (userData) => {
  return {
    type: SET_USER,
    payload: userData
  }
}