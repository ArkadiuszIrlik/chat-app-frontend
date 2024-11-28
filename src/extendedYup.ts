import * as Yup from 'yup';

interface OneOfSchemasOptions {
  errorMessage?: string;
  /** If none of the schemas match, uses the error returned by one of the
   * schemas as error message. Number value specifies the index of the
   * test whose error you want to return. Setting it to true will default
   * to last index. Default: false.
   */
  passNestedError: boolean | number;
}

Yup.addMethod(
  Yup.MixedSchema,
  'oneOfSchemas',
  function oneOfSchemas(
    schemas: Yup.AnySchema[],
    { errorMessage, passNestedError }: OneOfSchemasOptions = {
      passNestedError: false,
    },
  ) {
    return this.test(
      'one-of-schemas',
      errorMessage ??
        // eslint-disable-next-line no-template-curly-in-string
        'Not all items in ${path} match one of the allowed schemas',
      (item, context) => {
        const errors: string[] = [];
        let isValid = false;
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];
          try {
            schema.validateSync(item, { strict: true });
            isValid = true;
            break;
          } catch (e) {
            if (e instanceof Error) {
              errors.push(e.message);
            } else {
              errors.push('Unknown error');
            }
          }
        }

        if (isValid) {
          return isValid;
        }

        if (passNestedError === true) {
          return context.createError({ message: errors[errors.length - 1] });
        }

        if (passNestedError !== false) {
          return context.createError({ message: errors[passNestedError] });
        }

        return isValid;
      },
    );
  },
);

export { type OneOfSchemasOptions };
export default Yup;
