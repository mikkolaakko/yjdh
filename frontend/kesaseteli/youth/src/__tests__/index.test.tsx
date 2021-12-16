import { axe } from 'jest-axe';
import getIndexPageApi from 'kesaseteli/youth/__tests__/utils/components/get-index-page-api';
import renderPage from 'kesaseteli/youth/__tests__/utils/components/render-page';
import YouthIndex from 'kesaseteli/youth/pages';
import renderComponent from 'kesaseteli-shared/__tests__/utils/components/render-component';
import React from 'react';

const texts = {
  required: /tieto puuttuu/i,
  maxLength: /syöttämäsi tieto on liian pitkä/i,
  wrongFormat: /syöttämäsi tieto on virheellistä muotoa/i,
};

describe('frontend/kesaseteli/youth/src/pages/index.tsx', () => {
  it('should not violate accessibility', async () => {
    const {
      renderResult: { container },
    } = renderComponent(<YouthIndex />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('validating application', () => {
    it('shows required validation errors', async () => {
      await renderPage(YouthIndex);
      const indexPageApi = getIndexPageApi();
      await indexPageApi.expectations.pageIsLoaded();
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: false,
      });

      await indexPageApi.expectations.textInputHasError(
        'first_name',
        texts.required
      );
      await indexPageApi.expectations.textInputHasError(
        'last_name',
        texts.required
      );
      await indexPageApi.expectations.textInputHasError(
        'social_security_number',
        texts.required
      );
      await indexPageApi.expectations.schoolDropdownHasError(texts.required);
      await indexPageApi.expectations.textInputHasError(
        'email',
        texts.required
      );
      await indexPageApi.expectations.textInputHasError(
        'phone_number',
        texts.required
      );
      await indexPageApi.expectations.checkboxHasError(
        /olen lukenut palvelun käyttöehdot ja hyväksyn ne/i,
        texts.required
      );
    });

    it('shows max length exceeded validation errors', async () => {
      await renderPage(YouthIndex);
      const indexPageApi = getIndexPageApi();
      await indexPageApi.expectations.pageIsLoaded();

      indexPageApi.actions.typeInput('first_name', 'a'.repeat(129)); // max limit is 128
      indexPageApi.actions.typeInput('last_name', 'a'.repeat(129)); // max limit is 128
      indexPageApi.actions.typeInput('phone_number', 'a'.repeat(65)); // max limit is 254
      indexPageApi.actions.typeInput('email', 'a'.repeat(255)); // max limit is 254
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: false,
      });

      await indexPageApi.expectations.textInputHasError(
        'first_name',
        texts.maxLength
      );
      await indexPageApi.expectations.textInputHasError(
        'last_name',
        texts.maxLength
      );
      await indexPageApi.expectations.textInputHasError(
        'phone_number',
        texts.maxLength
      );
      await indexPageApi.expectations.textInputHasError(
        'email',
        texts.maxLength
      );
    });

    it('shows invalid format errors', async () => {
      await renderPage(YouthIndex);
      const indexPageApi = getIndexPageApi();
      await indexPageApi.expectations.pageIsLoaded();

      indexPageApi.actions.typeInput('first_name', '!#$%&()*+/:;<=>?@');
      indexPageApi.actions.typeInput('last_name', '~¡¿÷ˆ]+$');
      indexPageApi.actions.typeInput('social_security_number', '111111-111D');
      indexPageApi.actions.typeInput('phone_number', '+44-20-7011-5555');
      indexPageApi.actions.typeInput('email', 'aaaa@bbb');
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: false,
      });

      await indexPageApi.expectations.textInputHasError(
        'first_name',
        texts.wrongFormat
      );
      await indexPageApi.expectations.textInputHasError(
        'last_name',
        texts.wrongFormat
      );
      await indexPageApi.expectations.textInputHasError(
        'phone_number',
        texts.wrongFormat
      );
      await indexPageApi.expectations.textInputHasError(
        'email',
        texts.wrongFormat
      );
    });

    it('shows error messages for unlisted school', async () => {
      await renderPage(YouthIndex);
      const indexPageApi = getIndexPageApi();
      await indexPageApi.expectations.pageIsLoaded();
      await indexPageApi.expectations.inputIsNotPresent('unlisted_school');
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: false,
      });
      await indexPageApi.expectations.schoolDropdownHasError(texts.required);

      await indexPageApi.actions.toggleCheckbox(/koulua ei löydy listalta/i);
      await indexPageApi.expectations.schoolDropdownIsDisabled();
      await indexPageApi.expectations.schoolDropdownIsValid();
      await indexPageApi.expectations.inputIsPresent('unlisted_school');
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: false,
      });
      await indexPageApi.expectations.textInputHasError(
        'unlisted_school',
        texts.required
      );

      indexPageApi.actions.typeInput('unlisted_school', 'a'.repeat(257)); // max limit is 257
      await indexPageApi.expectations.textInputHasError(
        'unlisted_school',
        texts.maxLength
      );

      indexPageApi.actions.typeInput('unlisted_school', '!#$%&()*+/:;<=>?@');
      await indexPageApi.expectations.textInputHasError(
        'unlisted_school',
        texts.wrongFormat
      );

      await indexPageApi.actions.toggleCheckbox(/koulua ei löydy listalta/i);
      await indexPageApi.expectations.schoolDropdownIsEnabled();

      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: false,
      });
      await indexPageApi.expectations.schoolDropdownHasError(texts.required);
      await indexPageApi.expectations.inputIsNotPresent('unlisted_school');
    });
  });

  describe('when valid application', () => {
    it('sends application with listed school', async () => {
      await renderPage(YouthIndex);
      const indexPageApi = getIndexPageApi();
      await indexPageApi.expectations.pageIsLoaded();

      indexPageApi.actions.typeInput('first_name', 'Helinä');
      indexPageApi.actions.typeInput('last_name', "O'Hara");
      indexPageApi.actions.typeInput('social_security_number', '111111-111c');
      await indexPageApi.actions.typeAndSelectSchoolFromDropdown(
        'Iidenkiven P',
        'Hiidenkiven peruskoulu'
      );
      indexPageApi.actions.typeInput('phone_number', '+358-505-551-4995');
      indexPageApi.actions.typeInput('email', 'aaaa@bbb.test.fi');
      await indexPageApi.actions.toggleCheckbox(
        /olen lukenut palvelun käyttöehdot ja hyväksyn ne/i
      );
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: true,
      });
    });

    it('sends application with unlisted school', async () => {
      await renderPage(YouthIndex);
      const indexPageApi = getIndexPageApi();
      await indexPageApi.expectations.pageIsLoaded();

      indexPageApi.actions.typeInput('first_name', 'Helinä');
      indexPageApi.actions.typeInput('last_name', "O'Hara");
      indexPageApi.actions.typeInput('social_security_number', '111111-111c');
      await indexPageApi.actions.toggleCheckbox(/koulua ei löydy listalta/i);
      indexPageApi.actions.typeInput('unlisted_school', 'Erikoiskoulu');
      indexPageApi.actions.typeInput('phone_number', '+358-505-551-4995');
      indexPageApi.actions.typeInput('email', 'aaaa@bbb.test.fi');
      await indexPageApi.actions.toggleCheckbox(
        /olen lukenut palvelun käyttöehdot ja hyväksyn ne/i
      );
      await indexPageApi.actions.clickSaveButton({
        expectToPassValidation: true,
      });
    });
  });
});