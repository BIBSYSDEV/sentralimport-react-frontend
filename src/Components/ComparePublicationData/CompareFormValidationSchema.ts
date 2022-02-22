import * as Yup from 'yup';
import { DoiFormat } from '../../utils/stringUtils';

export const formValidationSchema = Yup.object().shape({
  //TODO: title: Yup.string().required('Tittel er et obligatorisk felt'),
  category: Yup.object().when('isInitiatedFromCristinPublication', {
    is: false,
    then: (schema) =>
      schema.shape({
        value: Yup.string().required(),
      }),
  }),
  year: Yup.string().when('isInitiatedFromCristinPublication', {
    is: false,
    then: (schema) =>
      schema
        .matches(/^[12][0-9]{3}$/, 'Årstall må være et tall fra 1000 til 2999')
        .required('Årstall er et obligatorisk felt'),
  }),
  doi: Yup.string().matches(DoiFormat, 'Doi har galt format'),
  journal: Yup.object().when('isInitiatedFromCristinPublication', {
    is: false,
    then: (schema) =>
      schema.shape({
        cristinTidsskriftNr: Yup.string().required('Tidsskrift er et obligatorisk felt'),
        title: Yup.string().required('Tittel er et obligatorisk felt'),
      }),
  }),
});
