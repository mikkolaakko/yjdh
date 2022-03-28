import { $PageHeading } from 'benefit/applicant/components/applications/Applications.sc';
import { Button, Logo, LogoLanguage } from 'hds-react';
import { GetStaticProps } from 'next';
import React from 'react';
import Container from 'shared/components/container/Container';
import FormSection from 'shared/components/forms/section/FormSection';
import { $GridCell, $Hr } from 'shared/components/forms/section/FormSection.sc';
import getServerSideTranslations from 'shared/i18n/get-server-side-translations';
import { openFileInNewTab } from 'shared/utils/file.utils';

import useApproveTermsOfServiceMutation from '../../hooks/useApproveTermsOfServiceMutation';
import useLogout from '../../hooks/useLogout';
import useTermsOfServiceData from '../../hooks/useTermsOfServiceData';
import { ApplicantConsents } from '../../types/application';
import PdfViewer from '../pdfViewer/PdfViewer';

const TermsOfService: React.FC = () => {
  const { locale, theme, t, termsInEffectUrl, userData } =
    useTermsOfServiceData();

  const { mutate: approveTermsOfService } = useApproveTermsOfServiceMutation();

  const logout = useLogout();

  return (
    <Container>
      <FormSection withoutDivider>
        <$GridCell $colSpan={3} style={{ marginTop: theme.spacingLayout.l }}>
          <Logo language={locale as LogoLanguage} size="large" />
        </$GridCell>
        <$GridCell $colStart={1} $colSpan={12}>
          <$PageHeading>{t('common:serviceName')}</$PageHeading>
        </$GridCell>
        <$GridCell $colSpan={12}>
          <h2 style={{ marginBottom: 0 }}>
            {t('common:login.termsOfServiceHeader')}
          </h2>
        </$GridCell>
        <$GridCell $colSpan={12}>
          <PdfViewer
            file={termsInEffectUrl}
            scale={1.8}
            documentMarginLeft="-70px"
          />
        </$GridCell>
        <$GridCell
          $colSpan={5}
          css={`
            margin-bottom: var(--spacing-l);
          `}
        >
          <Button
            theme="black"
            variant="secondary"
            onClick={() => openFileInNewTab(termsInEffectUrl)}
          >
            {t('common:applications.actions.openTermsAsPDF')}
          </Button>
        </$GridCell>
        <$GridCell $colSpan={12}>
          <$Hr />
        </$GridCell>
        <$GridCell $colSpan={7} style={{ display: 'flex' }}>
          <Button
            theme="coat"
            variant="primary"
            onClick={() =>
              approveTermsOfService({
                terms: userData?.termsOfServiceInEffect.id ?? '',
                selected_applicant_consents: userData
                  ? userData.termsOfServiceInEffect.applicantConsents.map(
                      (item: ApplicantConsents) => item.id
                    )
                  : [''],
              })
            }
            style={{ marginRight: theme.spacing.s }}
          >
            {t('common:applications.actions.continueToService')}
          </Button>
          <Button theme="black" variant="secondary" onClick={logout}>
            {t('common:applications.actions.pauseAndExit')}
          </Button>
        </$GridCell>
      </FormSection>
    </Container>
  );
};

export const getStaticProps: GetStaticProps =
  getServerSideTranslations('common');

export default TermsOfService;