// import { getAccessToken } from "@/lib/actions";

// const apiService = {
//   get: async function (url: string): Promise<any> {
//     console.log('GET', url);

//     const token = await getAccessToken();
//     if (!token) throw new Error("Access token missing");

//     return new Promise((resolve, reject) => {
//       fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       })
//         .then(res => res.json())
//         .then(json => {
//           console.log('Response:', json);
//           resolve(json);
//         })
//         .catch(err => reject(err));
//     });
//   },

//   post: async function (url: string, data: any): Promise<any> {
//     console.log('POST', url, data);

//     const token = await getAccessToken();
//     if (!token) throw new Error("Access token missing");

//     return new Promise((resolve, reject) => {
//       fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       })
//         .then(res => res.json())
//         .then(json => {
//           console.log('Response:', json);
//           resolve(json);
//         })
//         .catch(err => reject(err));
//     });
//   },

//   postWithoutToken: async function (url: string, data: any): Promise<any> {
//     console.log('POST without token', url, data);

//     const body = typeof data === 'object' ? JSON.stringify(data) : data;

//     return new Promise((resolve, reject) => {
//       fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body,
//       })
//         .then(res => res.json())
//         .then(json => {
//           console.log('Response:', json);
//           resolve(json);
//         })
//         .catch(err => reject(err));
//     });
//   },
// };

// export default apiService;


// src/services/apiService.ts
// 'use server'

// import { getAccessToken } from "@/lib/actions"

// const apiService = {
//   async get(url: string): Promise<any> {
//     console.log('GET (SSR)', url)

//     const token = await getAccessToken()
//     if (!token) throw new Error("Access token missing")

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       cache: 'no-store', // важно для SSR, чтобы всегда получать свежие данные
//     })

//     if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`)
//     const json = await res.json()
//     console.log('Response:', json)
//     return json
//   },

//   async post(url: string, data: any): Promise<any> {
//     console.log('POST (SSR)', url, data)

//     const token = await getAccessToken()
//     if (!token) throw new Error("Access token missing")

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     })

//     if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`)
//     return await res.json()
//   },

//   async postWithoutToken(url: string, data: any): Promise<any> {
//     console.log('POST without token (SSR)', url, data)

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })

//     if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`)
//     return await res.json()
//   },
// }

// export default apiService


import { getAccessToken } from "@/lib/actions";

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log('GET (SSR)', url);

    const token = await getAccessToken();

    // если токена нет — всё равно выполняем запрос (для публичных страниц)
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
};

export default apiService;

