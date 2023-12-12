const getFullUrl = (url) => {
  return import.meta.env.VITE_REACT_APP_API_HOST + url;
};

export function sendRequest(url, config) {
  console.log(url);
  return fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer `,
    },
    ...config,
  });
}

export function sendRequest_as_JSON(url, config) {
  // console.log(url);
  return fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer `,
      "Content-Type": "application/json",
    },
    ...config,
  });
}
