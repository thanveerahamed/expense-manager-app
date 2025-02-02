const NORDIGEN_REFERENCE = 'nordigen_reference';
export const storeNordigenReference = (reference: string): void =>
  window.localStorage.setItem(NORDIGEN_REFERENCE, reference);

export const getNordigenReference = (): string | undefined =>
  window.localStorage.getItem(NORDIGEN_REFERENCE) ?? undefined;

export const deleteNordigenReference = (): void =>
  window.localStorage.removeItem(NORDIGEN_REFERENCE);

export const setLocalCache = (reference: string, value: string) => {
  window.localStorage.setItem(reference, value);
};

export const getLocalCache = (reference: string): string | undefined =>
  window.localStorage.getItem(reference) ?? undefined;
