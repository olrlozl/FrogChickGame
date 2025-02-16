import { SearchFriendParams, SearchFriendResponse } from 'types/friend';
import instance from './axiosInstance';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const searchFriend = async ({
  nickname,
}: SearchFriendParams): Promise<SearchFriendResponse> => {
  const { data } = await instance.get(API_ENDPOINTS.SEARCH_FRIEND, {
    params: {
      nickname,
    },
  });
  return data;
};

export { searchFriend };
