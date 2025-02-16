import {
  ApplyFriendParams,
  SearchFriendParams,
  SearchFriendResponse,
} from 'types/friend';
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

const applyFriend = async ({ to }: ApplyFriendParams) => {
  await instance.post(API_ENDPOINTS.APPLY_FRIEND, {
    to,
  });
};

export { searchFriend, applyFriend };
