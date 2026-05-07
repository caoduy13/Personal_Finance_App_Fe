import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";
import type { CurrentUser } from "./types";

const PROFILE_STRATEGY = {
  me: "mock" as RequestMode,
} as const;

export const profileService = {
  async getMe(): Promise<CurrentUser> {
    const realRequest = () =>
      apiClient.get<CurrentUser>(API_ENDPOINT.USER.ME) as unknown as Promise<CurrentUser>;

    const mockRequest = async () => {
      await wait(250);
      return mockData.profile.getMe();
    };

    return requestWithStrategy(PROFILE_STRATEGY.me, realRequest, mockRequest);
  },
};
