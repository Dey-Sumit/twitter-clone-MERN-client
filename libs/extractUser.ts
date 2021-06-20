const sensitiveFields = ["password"];
export default function extractUser(user: any) {
  if (!user) return null;
  const obj = {};

  Object.keys(user._doc).forEach((key) => {
    if (!sensitiveFields.includes(key)) obj[key] = user[key];
  });

  return obj;
}
