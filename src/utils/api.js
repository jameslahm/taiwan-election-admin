const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:12345"
    : "https://damp-cliffs-99712.herokuapp.com";

class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const CONTENT_TYPE_JSON = "application/json";
const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new HTTPError(data.message, res.status);
  } else {
    return data;
  }
};

const uploadFile = ({ file, token }) => {
  const data = new FormData();
  data.append("file", file);
  return fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: data,
  })
    .then(handleRes)
    .then((res) => ({
      url: new URL(res.url, BASE_URL).toString(),
    }));
};

const login = (data) => {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

const getElectors = ({ token }) => {
  return fetch(`${BASE_URL}/electors`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then(handleRes)
    .then((res) =>
      res.map((e) => (e.avatar = new URL(e.avatar, BASE_URL).toString()))
    );
};

const getElector = ({ id, token }) => {
  return fetch(`${BASE_URL}/electors/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then(handleRes)
    .then((res) => (res.avatar = new URL(res.avatar, BASE_URL).toString()));
};

const createElector = ({ token, ...data }) => {
  return fetch(`${BASE_URL}/electors`, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

const deleteElector = ({ id, token }) => {
  return fetch(`${BASE_URL}/electors/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

const changeElector = ({ id, token, ...data }) => {
  return fetch(`${BASE_URL}/electors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export {
  getElectors,
  createElector,
  changeElector,
  deleteElector,
  login,
  getElector,
  uploadFile,
};
