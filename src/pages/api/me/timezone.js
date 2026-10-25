import { getUser } from '../../../lib/session.js';
import { setTimezone } from '../../../lib/member-data.js';

export async function POST(context) {
  const user = getUser(context);
  if (!user?.inServer) return context.redirect('/me');
  try {
    const form = await context.request.formData();
    await setTimezone(user.id, String(form.get('tz') || ''));
    return context.redirect('/me?saved=tz#settings');
  } catch (err) {
    console.error('Saving time zone failed:', err);
    return context.redirect('/me?error=tz#settings');
  }
}
