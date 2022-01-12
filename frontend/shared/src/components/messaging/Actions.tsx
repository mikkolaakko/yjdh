import { Button, IconLock, TextArea } from 'hds-react';
import React from 'react';
import { useTheme } from 'styled-components';

import { $Actions, $FormActions } from './Messaging.sc';

const Action: React.FC = () => {
  const theme = useTheme();

  return (
    <$Actions>
      <TextArea
        id="MessagesForm_Message"
        css={`
          margin-bottom: ${theme.spacing.s};
        `}
      />
      <$FormActions>
        <span>
          <IconLock />
          Viestit ovat salattuja
        </span>
        <Button type="submit" theme="coat" size="small" disabled>
          Lähetä
        </Button>
      </$FormActions>
    </$Actions>
  );
};

export default Action;