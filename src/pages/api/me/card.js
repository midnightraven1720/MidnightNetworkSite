import { getUser } from '../../../lib/session.js';
import { saveCard } from '../../../lib/member-data.js';

export async function POST(context) {
  const user = getUser(context);
  if (!user?.inServer) return context.redirect('/me');
  try {
    await saveCard(user.id, await context.request.formData());
    return context.redirect('/me?saved=card#card');
  } catch (err) {
    console.error('Saving DM card failed:', err);
    return context.redirect('/me?error=card#card');
  }
}
