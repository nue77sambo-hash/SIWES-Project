const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

const getHeaders = (authenticated = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authenticated && typeof window !== "undefined") {
    const token = localStorage.getItem("rootscroll_token");

    if (token) {
      headers.Authorization = `Token ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      (data ? JSON.stringify(data) : "Something went wrong.");

    throw new Error(message);
  }

  return data;
};

export const getBooks = async (params = "") => {
  const response = await fetch(
    `${API_BASE_URL}/books/${params}`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  return handleResponse(response);
};

export const getBookDetails = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/books/${id}/`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  return handleResponse(response);
};

export const getCategories = async () => {
  const response = await fetch(
    `${API_BASE_URL}/categories/`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  return handleResponse(response);
};

export const saveBook = async (bookId) => {
  const response = await fetch(
    `${API_BASE_URL}/saved-books/`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        book_id: bookId,
      }),
    }
  );

  return handleResponse(response);
};

export const requestBook = async (bookId) => {
  const response = await fetch(
    `${API_BASE_URL}/book-requests/`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        book_id: bookId,
      }),
    }
  );

  return handleResponse(response);
};