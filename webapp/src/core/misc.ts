import { Subscription } from "../store/application/types";

export enum Roles {
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export enum SubscriptionLevels {
  TRIAL = "TRIAL",
  BASIC = "BASIC",
  PRO = "PRO",
}

export const isEditor = (level?: Roles) => {
  return (
    level === Roles.EDITOR || level === Roles.ADMIN || level === Roles.OWNER
  );
};

export type personaBarState =
  | { page: "all" }
  | { page: "persona"; personaId?: string; edit: boolean }
  | { page: "create"; workflowId: string; workflowTitle: string };

export const memberLevelToTitle = (level?: string) => {
  switch (level) {
    case "VIEWER":
      return "Viewer";
    case "EDITOR":
      return "Editor";
    case "ADMIN":
      return "Admin";
    case "OWNER":
      return "Owner";
    default:
      return "";
  }
};

export enum Color {
  NONE = "",
  WHITE = "white",
  GREY = "gray",
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  TEAL = "teal",
  BLUE = "blue",
  PURPLE = "purple",
  PINK = "pink",
}

export enum Annotation2 {
  RISKY = "Risky",
  UNCLEAR = "Unclear",
  SPLIT = "Can be split",
  DEPENDENCY = "Has dependencies",
  BLOCKED = "Blocked",
  DISCUSSION = "Discussion needed",
  REJECTED = "Rejected",
  IDEA = "Idea",
  RESEARCH = "Research needed",
}

export type Annotation = {
  name: string;
  description: string;
  icon: string;
};

class Annotations {
  annotations: Annotation[];

  constructor(annotations: Annotation[]) {
    this.annotations = annotations;
  }

  getDescriptionByName = (name: string) => {
    return this.annotations.find((an) => an.name === name)?.description;
  };

  toString = () => {
    return this.annotations.map((a) => a.name).join(",");
  };

  add = (name: string) => {
    this.annotations.push(...annotationsFromNames([name]).annotations);
  };

  remove = (name: string[]) => {
    name.forEach((n) => {
      this.annotations = this.annotations.filter((an) => an.name !== n);
    });

    return this;
  };
}

const annotationsFromNames = (names: string[]): Annotations => {
  const ann = allAnnotations().annotations.flatMap((a) =>
    names.find((n) => n === a.name) ? a : []
  );
  return new Annotations(ann);
};

export const dbAnnotationsFromNames = (ann?: string) => {
  const list = ann?.split(",") ?? [];
  return annotationsFromNames(list);
};

export const allAnnotations = () => {
  return new Annotations([
    { name: "RISKY", description: "Risky", icon: "local_fire_department" },
    { name: "UNCLEAR", description: "Unclear", icon: "help_outline" },
    { name: "SPLIT", description: "Can be split", icon: "call_split" },
    { name: "DEPENDENCY", description: "Has dependencies", icon: "timeline" },
    { name: "BLOCKED", description: "Blocked", icon: "block" },
    { name: "DISCUSSION", description: "Discussion needed", icon: "group" },
    { name: "REJECTED", description: "Rejected", icon: "thumb_down" },
    { name: "IDEA", description: "Idea", icon: "star_border" },
    { name: "RESEARCH", description: "Research needed", icon: "fact_check" },
  ]);
};

export const Colors = new Array<Color>(
  Color.WHITE,
  Color.GREY,
  Color.RED,
  Color.ORANGE,
  Color.YELLOW,
  Color.TEAL,
  Color.BLUE,
  Color.PURPLE,
  Color.PINK
);

export const colorToSubtleBackgroundColorClass = (color?: Color) => {
  switch (color) {
    case Color.GREY:
      return "bg-gray-200";
    case Color.RED:
      return "bg-red-50";
    case Color.ORANGE:
      return "bg-orange-50";
    case Color.YELLOW:
      return "bg-yellow-50";
    case Color.TEAL:
      return "bg-green-50";
    case Color.BLUE:
      return "bg-blue-50";
    case Color.PURPLE:
      return "bg-purple-50";
    case Color.PINK:
      return "bg-pink-50";
    default:
      return "";
  }
};

export const colorToBackgroundColorClass = (color?: Color) => {
  switch (color) {
    case Color.WHITE:
      return "bg-white";
    case Color.GREY:
      return "bg-gray-500";
    case Color.RED:
      return "bg-red-500";
    case Color.ORANGE:
      return "bg-orange-500";
    case Color.YELLOW:
      return "bg-yellow-500";
    case Color.TEAL:
      return "bg-green-500";
    case Color.BLUE:
      return "bg-blue-500";
    case Color.PURPLE:
      return "bg-purple-500";
    case Color.PINK:
      return "bg-pink-500";
    case Color.NONE:
      return "bg-white";
    default:
      return "bg-white";
  }
};

export const colorToBorderColorClass = (color: Color) => {
  switch (color) {
    case Color.WHITE:
      return "border-gray-300";
    case Color.GREY:
      return "border-gray-500";
    case Color.RED:
      return "border-red-500";
    case Color.ORANGE:
      return "border-orange-500";
    case Color.YELLOW:
      return "border-yellow-500";
    case Color.TEAL:
      return "border-green-500";
    case Color.BLUE:
      return "border-blue-500";
    case Color.PURPLE:
      return "border-purple-500";
    case Color.PINK:
      return "border-pink-500";
    case Color.NONE:
      return "border-gray-500";
    default:
      return "border-gray-500";
  }
};

export const subIsInactive = (sub: Subscription) => {
  switch (sub.externalStatus) {
    case "incomplete_expired":
    case "incomplete":
    case "past_due":
    case "canceled":
      return true;
    case "trialing":
      return new Date(sub.expirationDate) < new Date();
    case "active":
      return false;
    default:
      return true;
  }
};

export const subIsTrial = (sub: Subscription) => {
  return sub.externalStatus === "trialing";
};

export const subIsBasicOrAbove = (sub: Subscription) => {
  return (
    sub.level === SubscriptionLevels.PRO ||
    sub.level === SubscriptionLevels.BASIC
  );
};
