import { getUser } from '../../../lib/session.js';
import { deleteReminder } from '../../../lib/member-data.js';

export async function POST(context) {
  const user = getUser(context);
  if (!user?.inServer) return context.redirect('/me');
  try {
    const form = await context.request.formData();
    await deleteReminder(user.id, form.get('id'));
    return context.redirect('/me?saved=reminder#reminders');
  } catch (err) {
    console.error('Cancelling reminder failed:', err);
    return context.redirect('/me?error=reminder#reminders');
  }
}
