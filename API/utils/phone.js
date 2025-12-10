import { parsePhoneNumberFromString } from "libphonenumber-js";

export const normalizePhone = (phone, country) => {
  const parsed = parsePhoneNumberFromString(phone, country);

  if (!parsed || !parsed.isValid()) {
    throw new Error("Invalid phone number");
  }

  return {
    e164: parsed.number, // +14155552671
    country: parsed.country, // US
    national: parsed.nationalNumber, // 4155552671
  };
};
