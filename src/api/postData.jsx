const AIRTABLE_API_KEY = 'patyOkldR8Ru7t7Vg.5bdd091e82a16b066ebe257d6d37163c9920bce6329c22c9c25d97fff959e762';
const BASE_ID = 'app27di9Mzgt9zhTa';
const TABLE_NAME = 'Work_Hours';

export async function postToAirtable(records) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}
