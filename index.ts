import axios from "axios";
import type { DeepLinkData } from "@types/branch-sdk";
import { required } from "./utils";

const request = axios.create({
  json: true,
  baseURL: "https://api2.branch.io/v1",
});

export type InitParams = { appId: string } | { key: string; secret?: string };

class BranchIoSdk {
  private readonly credentials:
    | { app_id: string }
    | { branch_key: string; branch_secret?: string };

  constructor({
    key,
    appId,
    secret,
  }: InitParams) {
    this.credentials = {
      app_id: appId,
      branch_key: key,
      branch_secret: secret,
    };

    this.checkCredentials();
  }

  checkCredentials(requireSecret = false) {
    required(
      {
        appId: this.credentials.app_id,
        branchKey: this.credentials.branch_key,
      },
      "Initialize branch sdk with either appId or branchKey"
    );

    if (this.credentials.app_id && this.credentials.branch_key) {
      throw new Error("Do not initialize branch with both appId and branchKey");
    }

    if (requireSecret) {
      required(
        {
          secret: this.credentials.branch_secret,
        },
        "Branch secret is required for this operation"
      );
    }
  }

  private async link(linkData: DeepLinkData): Promise<{ url: string }> {
    this.checkCredentials();

    const { data } = await request({
      url: "/url",
      method: "post",
      data: {
        ...linkData,
        app_id: this.credentials.app_id,
        branch_key: this.credentials.branch_key,
      },
    });

    return data;
  }

  async bulkLinks(linksData: DeepLinkData): Promise<Array<{ url: string }>> {
    this.checkCredentials();

    const { data } = await request({
      method: "post",
      data: linksData,
      url: `url/bulk/${this.credentials.branch_key || credentials.app_id}`,
    });

    return data;
  }

  async readLink(deepLink: string): Promise<Record<string, any>> {
    required({ deepLink });

    this.checkCredentials();

    const { data } = await request({
      url: "/url",
      params: {
        url: deepLink,
        app_id: this.credentials.app_id,
        branch_key: this.credentials.branch_key,
      },
    });

    return data;
  }

  async updateLink({
    data = null,
    deepLink = "",
  }: {
    deepLink: string;
    data: DeepLinkData;
  }): Promise<{ url: string; deleted: boolean }> {
    required({ data });
    required({ deepLink });

    this.checkCredentials(true);

    const { data: response } = await request({
      url: "/url",
      method: "put",
      data: {
        ...data,
        ...this.credentials,
      },
      params: {
        url: deepLink,
      },
    });

    return response;
  }

  async deleteLink(
    deepLink: string,
    accessToken: string
  ): Promise<{ url: string; deleted: boolean }> {
    required({ deepLink });
    required({ accessToken });
    required({ appId: this.checkCredentials.app_id });

    const { data: response } = await request({
      url: "/url",
      method: "delete",
      headers: {
        "Access-Token": accessToken,
      },
      params: {
        url: deepLink,
        app_id: this.credentials.app_id,
      },
    });

    return response;
  }

  async createReferralRule(ruleDetails = {}) {
    this.checkCredentials();

    const { data: response } = await request({
      url: "/eventresponse",
      method: "post",
      data: {
        ...ruleDetails,
        ...this.credentials,
      },
    });

    return response;
  }

  async redeem({ identity, amount, bucket }) {
    this.checkCredentials();

    const { data: response } = await request({
      url: "/redeem",
      method: "post",
      data: {
        amount,
        bucket,
        identity,
        ...this.credentials,
      },
    });

    return response;
  }

  async credits({ identity }) {
    this.checkCredentials();

    const { data: response } = await request({
      url: "/credits",
      method: "get",
      params: {
        identity,
        ...this.credentials,
      },
    });

    return response;
  }
}

const branchioSDK = (params: InitParams) => new BranchIoSdk(params);

export default branchioSDK;
