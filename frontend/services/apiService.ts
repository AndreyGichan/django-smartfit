import { getAccessToken } from "@/lib/actions";

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log('GET (SSR)', url);

    const token = await getAccessToken();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'GET',
      headers,
      cache: 'no-store', // для SSR — всегда свежие данные
    });

    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    const json = await res.json();
    console.log('Response:', json);
    return json;
  },

  post: async function (url: string, data: any): Promise<any> {
    console.log('POST (SSR)', url, data);

    const token = await getAccessToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    const json = await res.json();
    console.log('Response:', json);
    return json;
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    console.log('POST without token (SSR)', url, data);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    const json = await res.json();
    console.log('Response:', json);
    return json;
  },

  put: async function (url: string, data: any): Promise<any> {
    console.log('PUT (SSR)', url, data);

    const token = await getAccessToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    const json = await res.json();
    console.log('Response:', json);
    return json;
  },
};

export default apiService;

