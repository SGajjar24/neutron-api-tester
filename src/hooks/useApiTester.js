import { useState, useCallback } from 'react';
import axios from 'axios';
import { profileApi } from '../utils/apiProfiler';

export const useApiTester = () => {
  const [request, setRequest] = useState({
    url: '',
    method: 'GET',
    headers: [{ key: '', value: '', active: true }],
    params: [{ key: '', value: '', active: true }],
    body: '',
    auth: { type: 'none', config: {} }
  });

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('api-tester-history');
    return saved ? JSON.parse(saved) : [];
  });

  const sendRequest = useCallback(async () => {
    if (!request.url) return;

    setIsLoading(true);
    const startTime = performance.now();

    try {
      // Build Headers
      const headers = request.headers.reduce((acc, h) => {
        if (h.active && h.key) acc[h.key] = h.value;
        return acc;
      }, {});

      // Build Params
      const params = request.params.reduce((acc, p) => {
        if (p.active && p.key) acc[p.key] = p.value;
        return acc;
      }, {});

      // Prepare Axios Config
      const config = {
        url: request.url,
        method: request.method,
        headers,
        params,
        data: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        // For browser testing, CORS is the main issue.
        // We'll catch errors and provide context.
      };

      const res = await axios(config);
      const endTime = performance.now();
      const profile = profileApi(request.url, res);

      const responseData = {
        data: res.data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        time: Math.round(endTime - startTime),
        size: JSON.stringify(res.data).length,
        profile
      };

      setResponse(responseData);

      const historyItem = {
        ...request,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: res.status,
        profile
      };
      const newHistory = [historyItem, ...history.slice(0, 49)];
      setHistory(newHistory);
      localStorage.setItem('api-tester-history', JSON.stringify(newHistory));

    } catch (error) {
      const endTime = performance.now();
      const profile = error.response ? profileApi(request.url, error.response) : null;
      const errorData = {
        error: true,
        message: error.message,
        data: error.response?.data,
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Network Error',
        headers: error.response?.headers || {},
        time: Math.round(endTime - startTime),
        size: error.response?.data ? JSON.stringify(error.response.data).length : 0,
        profile
      };
      setResponse(errorData);
    } finally {
      setIsLoading(false);
    }
  }, [request, history]);

  const updateRequest = (updates) => {
    setRequest(prev => ({ ...prev, ...updates }));
  };

  return {
    request,
    updateRequest,
    response,
    isLoading,
    sendRequest,
    history,
    clearHistory: () => {
      setHistory([]);
      localStorage.removeItem('api-tester-history');
    }
  };
};
