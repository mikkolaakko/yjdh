import React, { useReducer } from 'react';
import { ModalProps } from 'shared/components/modal/Modal';

export type DialogPayload = {
  header: string;
  submitButtonLabel: ModalProps['submitButtonLabel'];
  submitButtonIcon?: ModalProps['submitButtonIcon'];
  content?: string;
};

export type DialogState = {
  show: boolean;
} & DialogPayload;

export enum DialogActionKind {
  SHOW_CONFIRM = 'SHOW_CONFIRM',
  HIDE_CONFIRM = 'HIDE_CONFIRM',
}

type ShowConfirmAction = {
  type: DialogActionKind.SHOW_CONFIRM;
  payload: DialogPayload;
};

type HideConfirmAction = {
  type: DialogActionKind.HIDE_CONFIRM;
  payload?: DialogPayload;
};

type DialogActionTypes = ShowConfirmAction | HideConfirmAction;

const initialState: DialogState = {
  show: false,
  header: '',
  submitButtonLabel: '',
  content: '',
};

const reducer = (
  state: DialogState,
  action: DialogActionTypes
): DialogState => {
  const content = action?.payload?.content ?? '';
  switch (action.type) {
    case DialogActionKind.SHOW_CONFIRM:
      return {
        show: true,
        header: action.payload.header,
        submitButtonLabel: action.payload.submitButtonLabel,
        submitButtonIcon: action.payload.submitButtonIcon,
        content,
      };

    case DialogActionKind.HIDE_CONFIRM:
    default:
      return initialState;
  }
};

export const DialogContext = React.createContext<
  [DialogState, React.Dispatch<DialogActionTypes>]
>([{ show: false, header: '', content: '', submitButtonLabel: '' }, () => {}]);

export const DialogContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DialogContext.Provider value={[state, dispatch]}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogContext;