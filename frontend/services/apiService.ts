import { getAccessToken } from "@/lib/actions";

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log('GET', url);

    const token = await getAccessToken();
    if (!token) throw new Error("Access token missing");

    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(json => {
          console.log('Response:', json);
          resolve(json);
        })
        .catch(err => reject(err));
    });
  },

  post: async function (url: string, data: any): Promise<any> {
    console.log('POST', url, data);

    const token = await getAccessToken();
    if (!token) throw new Error("Access token missing");

    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(json => {
          console.log('Response:', json);
          resolve(json);
        })
        .catch(err => reject(err));
    });
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    console.log('POST without token', url, data);

    // Если data — объект, отправляем как JSON
    const body = typeof data === 'object' ? JSON.stringify(data) : data;

    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      })
        .then(res => res.json())
        .then(json => {
          console.log('Response:', json);
          resolve(json);
        })
        .catch(err => reject(err));
    });
  },
};

export default apiService;
