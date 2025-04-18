'use server';

export const setConsent = (consent: boolean) => ({
  type: 'SET_CONSENT',
  payload: consent,
});
