export async function saveFinalReport(data) {
  const url = process.env.REACT_APP_PATIENT_RECORD_APP_URL;

  const payload = {
    mode: "final",
    ...data
  };

  const response = await fetch(url, {
    method: "POST",
    // 🚨 DO NOT ADD HEADERS
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Final save failed");
  }

  return await response.json();
}
