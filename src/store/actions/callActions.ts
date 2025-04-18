'use server';
export const approveScript = (script: string) => ({
  type: 'APPROVE_SCRIPT',
  payload: script,
});
