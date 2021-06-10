import { useTranslation } from 'benefit/applicant/i18n';
import { FormikProps, useFormik } from 'formik';
import { TFunction } from 'next-i18next';
import React, { FormEvent, useState } from 'react';
import { Field } from 'shared/components/forms/fields/types';

import { APPLICATION_FIELDS } from '../../../constants';
// import * as Yup from 'yup';

type ExtendedComponentProps = {
  t: TFunction;
  fieldNames: string[];
  fields: FieldsDef;
  translationsBase: string;
  getErrorMessage: (fieldName: string) => string | undefined;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formik: FormikProps<FormFields>;
};

type FieldsDef = {
  [key: string]: Field;
};

type FormFields = {
  [APPLICATION_FIELDS.HAS_COMPANY_OTHER_ADDRESS]: boolean;
  [APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_STREET]: string;
  [APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_ZIP]: string;
  [APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_DISTRICT]: string;
  [APPLICATION_FIELDS.COMPANY_IBAN]: string;
  [APPLICATION_FIELDS.CONTACT_PERSON_FIRST_NAME]: string;
  [APPLICATION_FIELDS.CONTACT_PERSON_LAST_NAME]: string;
  [APPLICATION_FIELDS.CONTACT_PERSON_PHONE]: string;
  [APPLICATION_FIELDS.CONTACT_PERSON_EMAIL]: string;
  [APPLICATION_FIELDS.DE_MINIMIS_AIDS_GRANTED]: string;
  [APPLICATION_FIELDS.COLLECTIVE_BARGAINING_ONGOING]: string;
  [APPLICATION_FIELDS.COLLECTIVE_BARGAINING_INFO]: string;
};

const useComponent = (): ExtendedComponentProps => {
  const { t } = useTranslation();
  const translationsBase = 'common:applications.sections.company';
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      [APPLICATION_FIELDS.HAS_COMPANY_OTHER_ADDRESS]: false,
      [APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_STREET]: '',
      [APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_ZIP]: '',
      [APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_DISTRICT]: '',
      [APPLICATION_FIELDS.COMPANY_IBAN]: '',
      [APPLICATION_FIELDS.CONTACT_PERSON_FIRST_NAME]: '',
      [APPLICATION_FIELDS.CONTACT_PERSON_LAST_NAME]: '',
      [APPLICATION_FIELDS.CONTACT_PERSON_PHONE]: '',
      [APPLICATION_FIELDS.CONTACT_PERSON_EMAIL]: '',
      [APPLICATION_FIELDS.DE_MINIMIS_AIDS_GRANTED]: '',
      [APPLICATION_FIELDS.COLLECTIVE_BARGAINING_ONGOING]: '',
      [APPLICATION_FIELDS.COLLECTIVE_BARGAINING_INFO]: '',
    },
    // Define Yup validation schema
    // validationSchema: Yup.object().shape({
    //  companyOtherAddressStreet: Yup.boolean().required('Please enter..'),
    // }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      // console.log('Form submitted:', values);
    },
  });

  const fieldNames = React.useMemo(
    (): string[] => [
      APPLICATION_FIELDS.HAS_COMPANY_OTHER_ADDRESS,
      APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_STREET,
      APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_ZIP,
      APPLICATION_FIELDS.COMPANY_OTHER_ADDRESS_DISTRICT,
      APPLICATION_FIELDS.COMPANY_IBAN,
      APPLICATION_FIELDS.CONTACT_PERSON_FIRST_NAME,
      APPLICATION_FIELDS.CONTACT_PERSON_LAST_NAME,
      APPLICATION_FIELDS.CONTACT_PERSON_PHONE,
      APPLICATION_FIELDS.CONTACT_PERSON_EMAIL,
      APPLICATION_FIELDS.DE_MINIMIS_AIDS_GRANTED,
      APPLICATION_FIELDS.COLLECTIVE_BARGAINING_ONGOING,
      APPLICATION_FIELDS.COLLECTIVE_BARGAINING_INFO,
    ],
    []
  );

  const fields = React.useMemo((): FieldsDef => {
    const fieldsdef: FieldsDef = {};
    fieldNames.forEach((name) => {
      fieldsdef[name] = {
        name,
        label: t(`${translationsBase}.fields.${name}.label`),
        placeholder: t(`${translationsBase}.fields.${name}.placeholder`),
      };
    });
    return fieldsdef;
  }, [t, fieldNames]);

  const getErrorMessage = (fieldName: string): string | undefined =>
    // todo: implement error messages
    // (getIn(formik.touched, fieldName) || isSubmitted) &&
    // getIn(formik.errors, fieldName)
    isSubmitted ? fieldName : '';

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitted(true);
    void formik.validateForm().then((errors) => {
      // todo: Focus the first invalid field
      const invalidFields = Object.keys(errors);
      if (invalidFields.length === 0) {
        void formik.submitForm();
      }
      return null;
    });
  };

  return {
    t,
    fieldNames,
    fields,
    translationsBase,
    formik,
    getErrorMessage,
    handleSubmit,
  };
};

export { useComponent };