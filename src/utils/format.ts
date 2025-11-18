export const uppercaseTitle = (s: string | undefined) => {
  if (!s) return "";

  const map: Record<string, string> = {
    mr: "Mr.",
    mrs: "Mrs.",
    miss: "Miss",
    ms: "Ms.",
    dr: "Dr.",
    eng: "Eng.",
    prof: "Prof.",
    sir: "Sir",
    madam: "Madam",
  };

  const key = s.trim().toLowerCase();
  return map[key] ?? s;
};
