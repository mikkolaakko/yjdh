import { useContext } from 'react';
import DialogContext from 'tet/admin/store/DialogContext';
import { HIDE_CONFIRM, SHOW_CONFIRM, DialogAction } from 'tet/admin/store/DialogContext';
import { DialogActionKind } from 'tet/admin/store/DialogContext';

type ResolverCallback = (a: boolean) => void;

let resolveCallback: ResolverCallback;
function useConfirm() {
  const [confirmState, dispatch] = useContext(DialogContext);

  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };
  const confirm = (header: string, content?: string) => {
    dispatch({
      type: DialogActionKind.SHOW_CONFIRM,
      payload: {
        header,
        content,
      },
    });
    return new Promise((res, rej) => {
      resolveCallback = res;
    });
  };

  const closeConfirm = () => {
    dispatch({
      type: DialogActionKind.HIDE_CONFIRM,
    });
  };

  return { confirm, onConfirm, onCancel, confirmState };
}

export default useConfirm;