import {
  getToken,
  handleSessionExpired,
} from "./auth";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

// CENTRAL API REQUEST HANDLER

const apiRequest = async (
  endpoint,
  {
    method = "GET",
    body,
    authenticated = false,
    headers = {},
    ...options
  } = {}
) => {
  const token = authenticated ? getToken() : null;

  if (authenticated && !token) {
    const error = new Error("Please sign in to continue.");
    error.status = 401;
    throw error;
  }

  const requestHeaders = { ...headers };

  if (
    body !== undefined &&
    !(typeof FormData !== "undefined" && body instanceof FormData)
  ) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body,
    cache: "no-store",
    ...options,
  });

  const data = await response.json().catch(() => null);

  // Handle expired sessions
  if (response.status === 401 && token) {
    handleSessionExpired();
  }

  // Handle API errors
  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.non_field_errors?.[0] ||
      Object.values(data || {})
        .flat(Infinity)
        .find((error) => typeof error === "string") ||
      "Something went wrong. Please try again.";

    const error = new Error(message);
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

// BOOKS

export const getBooks = async (params = "") => {
  return apiRequest(`/books/${params}`);
};

export const getBookDetails = async (id) => {
  return apiRequest(`/books/${id}/`);
};

// CATEGORIES

export const getCategories = async () => {
  return apiRequest("/categories/");
};

// SAVED BOOKS

export const getSavedBooks = async () => {
  return apiRequest("/saved-books/", {
    authenticated: true,
  });
};

export const saveBook = async (bookId) => {
  return apiRequest("/saved-books/", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify({
      book_id: bookId,
    }),
  });
};

export const removeSavedBook = async (savedBookId) => {
  return apiRequest(`/saved-books/${savedBookId}/`, {
    method: "DELETE",
    authenticated: true,
  });
};

// BOOK REQUESTS

export const getBookRequests = async () => {
  return apiRequest("/book-requests/", {
    authenticated: true,
  });
};

export const requestBook = async (bookId) => {
  return apiRequest("/book-requests/", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify({
      book_id: bookId,
    }),
  });
};

export const cancelBookRequest = async (requestId) => {
  return apiRequest(`/book-requests/${requestId}/cancel/`, {
    method: "POST",
    authenticated: true,
  });
};