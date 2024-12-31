import { apiRequest } from './api';


interface FetchCFNReplaysOptions {
  id?: number;
  characterName?: string;
  cfnUserId?: number;
  cfnName?: string;
}

export const fetchCFNReplays = (options: FetchCFNReplaysOptions = {}) => {
    const params = new URLSearchParams();
  
    if (options.id !== undefined) {
      params.set('id', String(options.id));
    }
  
    if (options.characterName) {
      params.set('characterName', options.characterName);
    }
  
    if (options.cfnUserId !== undefined) {
      params.set('cfnUserId', String(options.cfnUserId));
    }
  
    if (options.cfnName) {
      params.set('cfnName', options.cfnName);
    }
  
    const queryString = params.toString();
    const url = `/api/cfnreplays${queryString ? `?${queryString}` : ''}`; 
  
    return apiRequest(url, 'GET');
  };
  
