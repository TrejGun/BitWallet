import * as log from "loglevel";
import {
  VALIDATION_ADD,
  VALIDATION_ADD_ALL,
  VALIDATION_REMOVE,
  VALIDATION_REMOVE_ALL,
} from "../components/input/actions";


const validations = [];

export default function update (state = validations, action) {
  switch (action.type) {
    case VALIDATION_ADD:
      log.error(action.payload);
      return [...state, action.payload];
    case VALIDATION_ADD_ALL:
      log.error(action.payload);
      return [...state, ...action.payload];
    case VALIDATION_REMOVE:
      return state.filter(message => message !== action.payload);
    case VALIDATION_REMOVE_ALL:
      return [];
    default:
      return state;
  }
}
