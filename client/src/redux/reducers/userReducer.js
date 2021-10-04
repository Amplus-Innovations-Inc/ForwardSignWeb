export default function userReducer(state = { userName: "" }, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        userName: action.userName,
      };
    default:
      return state;
  }
}
