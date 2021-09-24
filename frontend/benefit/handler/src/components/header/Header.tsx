import * as React from 'react';
import BaseHeader from 'shared/components/header/Header';

import { useHeader } from './useHeader';

const Header: React.FC = () => {
  const {
    t,
    locale,
    languageOptions,
    handleLanguageChange,
    handleNavigationItemClick,
    handleTitleClick,
  } = useHeader();

  return (
    <BaseHeader
      title={t('common:appName')}
      menuToggleAriaLabel={t('common:menuToggleAriaLabel')}
      languages={languageOptions}
      locale={locale}
      onLanguageChange={handleLanguageChange}
      onNavigationItemClick={handleNavigationItemClick}
      onTitleClick={handleTitleClick}
    />
  );
};

export default Header;