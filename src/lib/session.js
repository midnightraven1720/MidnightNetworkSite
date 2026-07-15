const STAFF_TIERS = ['owner', 'coOwner', 'staff'];

export function getUser(Astro) {
  const sessionCookie = Astro.cookies.get('midnight_session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export function isStaff(user) {
  return !!user && STAFF_TIERS.includes(user.rank);
}

export function requireAuth(Astro) {
  const user = getUser(Astro);
  if (!user) {
    return { user: null, redirect: Astro.redirect('/login') };
  }
  return { user, redirect: null };
}

export function requireStaff(Astro) {
  const { user, redirect } = requireAuth(Astro);
  if (redirect) return { user, redirect };
  if (!isStaff(user)) {
    return { user, redirect: Astro.redirect('/user-dashboard') };
  }
  return { user, redirect: null };
}
