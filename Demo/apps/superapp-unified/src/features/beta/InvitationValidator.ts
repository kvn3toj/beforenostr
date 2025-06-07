export const validateInvitationCode = async (code: string): Promise<boolean> => {
  // TODO: Implement API call to backend for invitation validation
  return code.length === 8 && /^[A-Z0-9]+$/.test(code);
};
