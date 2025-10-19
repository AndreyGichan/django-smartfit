'use server';

import { cookies } from 'next/headers';

export async function handleRefresh(): Promise<string | undefined> {
  console.log('handleRefresh');

  const refreshToken = await getRefreshToken();
  if (!refreshToken) return undefined;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    const json = await res.json();
    console.log('Response - Refresh:', json);

    const cookieStore = await cookies();

    if (json.access) {
      return json.access;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('handleRefresh error:', error);
    return undefined;
  }
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set('session_userid', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 неделя
    path: '/'
  });

  cookieStore.set('session_access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 60 минут
    path: '/'
  });

  cookieStore.set('session_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 неделя
    path: '/'
  });
}

export async function resetAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set('session_userid', '');
  cookieStore.set('session_access_token', '');
  cookieStore.set('session_refresh_token', '');
}

export async function getUserId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_userid')?.value;
  return userId ?? undefined;
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('session_access_token')?.value;

  if (!accessToken) {
    accessToken = await handleRefresh();
  }

  return accessToken;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('session_refresh_token')?.value;
  return refreshToken ?? undefined;
}
