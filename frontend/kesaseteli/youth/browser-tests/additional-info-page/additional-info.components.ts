import AdditionalInfoFormData from '@frontend/kesaseteli-shared/src/types/additional-info-form-data';
import AdditionalInfoReasonType from '@frontend/kesaseteli-shared/src/types/additional-info-reason-type';
import { htmlElementClick } from '@frontend/shared/browser-tests/utils/html.utils';
import { fillInput } from '@frontend/shared/browser-tests/utils/input.utils';
import {
  getErrorMessage,
  screenContext,
  withinContext,
} from '@frontend/shared/browser-tests/utils/testcafe.utils';
import { MAIN_CONTENT_ID } from '@frontend/shared/src/constants';
import { Language } from '@frontend/shared/src/i18n/i18n';
import { escapeRegExp } from '@frontend/shared/src/utils/regex.utils';
import TestController from 'testcafe';

import getTranslations from '../../src/__tests__/utils/i18n/get-translations';

export const getAdditionalInfoPageComponents = async (
  t: TestController,
  lang?: Language
) => {
  const screen = screenContext(t);
  const within = withinContext(t);
  const translations = await getTranslations(lang);
  type NotificationType = Extract<
    keyof typeof translations.additionalInfo.notification,
    'confirmed' | 'sent' | 'notFound'
  >;

  const withinMain = (): ReturnType<typeof within> =>
    within(screen.getByTestId(MAIN_CONTENT_ID));

  const withinForm = (): ReturnType<typeof within> =>
    within(withinMain().getByTestId('additional-info-form'));
  const selectors = {
    title() {
      return withinMain().findByRole('heading', {
        name: translations.additionalInfo.title,
      });
    },
    reasonOption(reason: AdditionalInfoReasonType) {
      return withinForm().findByRole('option', {
        name: escapeRegExp(translations.additionalInfo.reasons[reason], 'i'),
      });
    },
    additionalInfoDescription() {
      return withinForm().findByRole('textbox', {
        name: escapeRegExp(
          translations.additionalInfo.form.additional_info_description,
          'i'
        ),
      });
    },
    sendButton() {
      return withinForm().findByRole('button', {
        name: translations.additionalInfo.form.sendButton,
      });
    },
    notification(type: NotificationType) {
      return withinMain().findByRole('heading', {
        name: translations.additionalInfo.notification[type],
      });
    },
  };
  const expectations = {
    async isLoaded() {
      await t.expect(selectors.title().exists).ok(await getErrorMessage(t));
      await t
        .expect(selectors.notification('confirmed').exists)
        .ok(await getErrorMessage(t));
    },
    async showsNotification(type: NotificationType) {
      await t
        .expect(selectors.notification(type).exists)
        .ok(await getErrorMessage(t));
    },
  };
  const actions = {
    async clickAndSelectReasonsFromDropdown(
      reasons: AdditionalInfoReasonType[]
    ) {
      await htmlElementClick('#additional_info_user_reasons-toggle-button');
      /* eslint-disable no-await-in-loop */
      // eslint-disable-next-line no-restricted-syntax
      for (const reason of reasons) {
        await t.click(selectors.reasonOption(reason));
      }
      /* eslint-enable no-await-in-loop */
      await htmlElementClick('#additional_info_user_reasons-toggle-button');
    },
    async typeAdditionalInfoDescription(text: string) {
      await fillInput<AdditionalInfoFormData>(
        t,
        'additional_info_description',
        selectors.additionalInfoDescription(),
        text
      );
    },
    async clickSendButton() {
      await t.click(selectors.sendButton());
    },
  };
  await expectations.isLoaded();
  return {
    selectors,
    expectations,
    actions,
  };
};