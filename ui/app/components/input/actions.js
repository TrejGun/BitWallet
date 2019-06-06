export const VALIDATION_ADD = "VALIDATION_ADD";
export const VALIDATION_ADD_ALL = "VALIDATION_ADD_ALL";
export const VALIDATION_REMOVE = "VALIDATION_REMOVE";
export const VALIDATION_REMOVE_ALL = "VALIDATION_REMOVE_ALL";


export function addValidationMessage (message) {
  return {
    type: VALIDATION_ADD,
    payload: message,
  };
}

export function delValidationMessage (message) {
  return {
    type: VALIDATION_REMOVE,
    payload: message,
  };
}
