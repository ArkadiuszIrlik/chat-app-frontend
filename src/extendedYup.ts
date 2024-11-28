import * as Yup from 'yup';

Yup.addMethod(
  Yup.MixedSchema,
  'oneOfSchemas',
  function oneOfSchemas(schemas: Yup.AnySchema[], errorMessage?: string) {
    return this.test(
      'one-of-schemas',
      errorMessage ??
        // eslint-disable-next-line no-template-curly-in-string
        'Not all items in ${path} match one of the allowed schemas',
      (item) =>
        schemas.some((schema) => schema.isValidSync(item, { strict: true })),
    );
  },
);

export default Yup;
