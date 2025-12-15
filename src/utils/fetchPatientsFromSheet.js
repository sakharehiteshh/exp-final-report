export async function fetchPatientsFromSheet() {
  const url = process.env.REACT_APP_PATIENT_RECORD_APP_URL;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.success) throw new Error(json.error);
  return json.data;
}
