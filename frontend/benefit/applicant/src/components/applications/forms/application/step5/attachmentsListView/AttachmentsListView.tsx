import { ATTACHMENT_TYPES } from 'benefit/applicant/constants';
import { IconPaperclip } from 'hds-react';
import * as React from 'react';
import { $GridCell } from 'shared/components/forms/section/FormSection.sc';
import theme from 'shared/styles/theme';
import Attachment from 'shared/types/attachment';

import { $ViewField, $ViewFieldBold } from '../../Application.sc';

export interface AttachmentsListViewProps {
  attachments: Attachment[];
  type: ATTACHMENT_TYPES;
  title?: string;
}

const AttachmentsListView: React.FC<AttachmentsListViewProps> = ({
  attachments,
  type,
  title,
}) => {
  const attachmentItems = React.useMemo(
    (): Attachment[] =>
      attachments?.filter((att: Attachment) => att.attachmentType === type),
    [attachments, type]
  );

  return (
    <>
      {attachmentItems.length > 0 && (
        <$GridCell $colStart={1} $colSpan={6}>
          {title && <$ViewFieldBold>{title}</$ViewFieldBold>}
          {attachmentItems.map((attachment: Attachment) => (
            <$ViewField
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: `${theme.spacing.xs} 0`,
                fontSize: theme.fontSize.body.m,
              }}
              key={attachment.attachmentFileName}
            >
              <IconPaperclip aria-label={attachment.attachmentFileName} />
              {attachment.attachmentFileName}
            </$ViewField>
          ))}
        </$GridCell>
      )}
    </>
  );
};

export default AttachmentsListView;
