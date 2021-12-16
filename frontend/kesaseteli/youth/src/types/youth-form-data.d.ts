import School from 'kesaseteli/youth/types/School';
import YouthApplication from 'kesaseteli/youth/types/youth-application';

type YouthFormData = Omit<YouthApplication, 'school'> & {
  school?: School | null;
  unlisted_school?: string | null;
  termsAndConditions: boolean;
};

export default YouthFormData;