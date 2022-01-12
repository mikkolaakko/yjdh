import { APPLICATION_STATUSES } from 'benefit/handler/constants';
import { useApplicationActions } from 'benefit/handler/hooks/useApplicationActions';
import { Application } from 'benefit/handler/types/application';
import { Button, IconLock, IconPen } from 'hds-react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

export type Props = {
  application: Application;
};

const EditAction: React.FC<Props> = ({ application }) => {
  const translationsBase = 'common:review.actions';
  const { t } = useTranslation();
  const { updateStatus } = useApplicationActions(application);

  return (
    <>
      {application.status === APPLICATION_STATUSES.HANDLING && (
        <Button
          onClick={() => updateStatus(APPLICATION_STATUSES.INFO_REQUIRED)}
          theme="black"
          variant="secondary"
          iconLeft={<IconPen />}
        >
          {t(`${translationsBase}.handlingToInfoRequired`)}
        </Button>
      )}
      {application.status === APPLICATION_STATUSES.INFO_REQUIRED && (
        <Button
          onClick={() => updateStatus(APPLICATION_STATUSES.HANDLING)}
          theme="black"
          variant="secondary"
          iconLeft={<IconLock />}
        >
          {t(`${translationsBase}.infoRequiredToHandling`)}
        </Button>
      )}
    </>
  );
};

export default EditAction;