export function getUpdatedFields<T extends PlainObject>(initial: T, form: T): Partial<T> {
  let updatedFields: Partial<T> = {};

  Object.keys(form).forEach(key => {
    if (form[key as keyof T] !== initial[key as keyof T]) {
      updatedFields[key as keyof T] = form[key as keyof T];
    }
  });

  return updatedFields;
}