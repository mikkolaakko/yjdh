import { BackendEndpoint } from 'kesaseteli/employer/backend-api/backend-api';
import useBackendAPI from 'kesaseteli/employer/hooks/backend/useBackendAPI';
import * as React from 'react';
import { KesaseteliAttachment } from 'shared/types/attachment';

const useOpenAttachment = (): ((
  attachment: KesaseteliAttachment
) => Promise<void>) => {
  const { axios, handleResponse } = useBackendAPI();

  return React.useCallback(
    async (attachment: KesaseteliAttachment) => {
      const { id: attachmentId, summer_voucher, content_type } = attachment;
      const data = await handleResponse<Blob>(
        axios.get(
          `${BackendEndpoint.SUMMER_VOUCHERS}${summer_voucher}${BackendEndpoint.ATTACHMENTS}${attachmentId}`,
          { responseType: 'blob' }
        )
      );
      if (data instanceof Blob) {
        const file = new Blob([data], { type: content_type });
        const fileURL = URL.createObjectURL(file);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const newTab = window.open(fileURL, '_blank');
        if (newTab) {
          newTab.focus();
        }
      }
    },
    [axios, handleResponse]
  );
};

export default useOpenAttachment;
