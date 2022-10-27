import type { MessageEntity } from "../../components/Message";
import { Roles, SubscriptionLevels } from "../../core/misc";

export type Application = {
  workspaces: Array<Workspace>;
  memberships: Array<Membership>;
  account?: IAccount;
  messages: Array<MessageEntity>;
  subscriptions: Array<Subscription>;
};

export type Membership = {
  id: string;
  workspaceId: string;
  accountId: string;
  level: Roles;
  name: string;
  email: string;
  createdAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  createdAt: string;
  allowExternalSharing: boolean;
  euVat: string;
  externalBillingEmail: string;
  status: string;
};

export type IAccount = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  emailConfirmed: boolean;
  emailConfirmationSentTo: string;
  emailConfirmationPending: boolean;
};

export type Subscription = {
  id: string;
  workspaceId: string;
  level: SubscriptionLevels;
  numberOfEditors: number;
  fromDate: string;
  expirationDate: string;
  createdByName: string;
  createdAt: string;
  lastModified: string;
  lastModifiedByName: string;
  externalStatus: string;
  externalPlanId: string;
};

export type IInvite = {
  id: string;
  workspaceId: string;
  email: string;
  level: string;
  code: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  createdByEmail: string;
  workspaceName: string;
};
