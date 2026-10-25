// Discord modals cap out at 5 text inputs, so the dashboard form only offers 5 question slots.
export function parseCustomFields(formData) {
  const fields = [];
  for (let i = 0; i < 5; i++) {
    const label = (formData.get(`customFieldLabel${i}`) || '').trim();
    if (!label) continue;
    fields.push({
      label,
      style: formData.get(`customFieldStyle${i}`) === 'paragraph' ? 'paragraph' : 'short',
      required: formData.get(`customFieldRequired${i}`) === 'on',
    });
  }
  return fields;
}
