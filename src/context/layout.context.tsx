import React, {
  createContext,
  MouseEventHandler,
  useContext,
  useReducer,
} from "react";

interface IModalData {
  subTitle: string;
  handleConfirmation: MouseEventHandler<any>;
  buttonText: string;
}
interface IState {
  showNavbar: boolean;
  showAuthModal: boolean;
  showConfirmationModal: boolean;
  modalData?: IModalData;
}
type ActionType =
  | "SHOW_AUTH_MODAL"
  | "HIDE_CONFIRMATION_MODAL"
  | "TOGGLE_NAVBAR"
  | "SHOW_CONFIRMATION_MODAL"
  | "HIDE_AUTH_MODAL";
interface IAction {
  type: ActionType;
  payload?: IModalData;
}

// create two context; one for the state and one for the dispatchs
const StateContext = createContext<IState>(undefined);

const DispatchContext = createContext<React.Dispatch<IAction>>(null);

const reducer = (state: IState, { type, payload }: IAction) => {
  switch (type) {
    case "SHOW_AUTH_MODAL":
      return {
        ...state,
        showAuthModal: true,
      };
    case "HIDE_AUTH_MODAL":
      return {
        ...state,
        showAuthModal: false,
      };

    case "SHOW_CONFIRMATION_MODAL":
      return {
        ...state,
        showConfirmationModal: true,
        modalData: payload,
      };

    case "HIDE_CONFIRMATION_MODAL":
      return {
        ...state,
        showConfirmationModal: false,
      };

    case "TOGGLE_NAVBAR":
      return {
        ...state,
        showNavbar: !state.showNavbar,
      };

    default:
      throw new Error(`Unknown action type"${type}`);
  }
};

export const LayoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(
    reducer,
    {
      showAuthModal: null,
      showNavbar: false,
      showConfirmationModal: null,
      modalData: null,
    }
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useLayoutState = () => useContext(StateContext);
export const useLayoutDispatch = () => useContext(DispatchContext);
