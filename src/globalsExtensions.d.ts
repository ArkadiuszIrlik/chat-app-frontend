declare module 'yup' {
  interface MixedSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    oneOfSchemas(
      schemas: Yup.AnySchema[],
      errorMessage?: string,
    ): MixedSchema<TType, TContext>;
  }
}

export {};
