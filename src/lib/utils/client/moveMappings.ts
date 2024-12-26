import { apiRequest } from './api';

export const fetchMoveMapping = (id: number) =>
  apiRequest(`/api/move_name/${id}`, 'GET');

export const updateMoveMapping = (id: number, moveName: string) =>
  apiRequest(`/api/move_name/${id}`, 'PUT', { moveName });

export const deleteMoveMapping = (id: number) =>
  apiRequest(`/api/move_name/${id}`, 'DELETE');
