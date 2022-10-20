import { AvatarName } from "../../avatars";

export type IPersona = {
  workspaceId: string;
  projectId: string;
  id: string;
  name: string;
  role: string;
  avatar: AvatarName;
  description: string;
  createdAt: string;
};
