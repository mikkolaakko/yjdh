import useApplicationApi from 'kesaseteli/employer/hooks/application/useApplicationApi';
import { useTranslation } from 'next-i18next';
import React from 'react';
import LoadingSkeleton from 'react-loading-skeleton';
import isServerSide from 'shared/server/is-server-side';

import { $CompanyInfoCell, $CompanyInfoGrid } from './CompanyInfo.sc';
import CompanyInfoHeader, { CompanyProp } from './CompanyInfoHeader';

const CompanyInfo: React.FC = () => {
  const { t } = useTranslation();
  const { application, isError, isLoading } = useApplicationApi();
  const CompanyFieldCell: React.FC<CompanyProp> = ({ field }: CompanyProp) => (
    <$CompanyInfoCell aria-labelledby={field} role="gridcell">
      {isLoading && !isServerSide() && <LoadingSkeleton width="90%" />}
      {(!isLoading && !isError && application?.company?.[field]) || ''}
    </$CompanyInfoCell>
  );

  return (
    <$CompanyInfoGrid
      role="grid"
      aria-label={t(`common:application.step1.companyInfoGrid.title`)}
    >
      <CompanyInfoHeader field="name" />
      <CompanyInfoHeader field="business_id" />
      <CompanyInfoHeader field="industry" />
      <CompanyInfoHeader field="company_form" />
      <CompanyInfoHeader field="postcode" />
      <CompanyInfoHeader field="city" />
      <CompanyFieldCell field="name" />
      <CompanyFieldCell field="business_id" />
      <CompanyFieldCell field="industry" />
      <CompanyFieldCell field="company_form" />
      <CompanyFieldCell field="postcode" />
      <CompanyFieldCell field="city" />
    </$CompanyInfoGrid>
  );
};

export default CompanyInfo;