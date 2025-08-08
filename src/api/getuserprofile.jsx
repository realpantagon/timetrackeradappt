const AIRTABLE_API_KEY = 'patyOkldR8Ru7t7Vg.5bdd091e82a16b066ebe257d6d37163c9920bce6329c22c9c25d97fff959e762';
const BASE_ID = 'app27di9Mzgt9zhTa';
const TABLE_NAME = 'Employees';

export async function getUserProfile(username) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula={Full Name}='${username}'`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  const data = await res.json();
  return data.records.length > 0 ? data.records[0] : null;
}
