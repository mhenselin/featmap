import { createSelector } from "reselect";
import { AppState } from "..";
import { IFeature } from "./types";

const getFeaturesState = (state: AppState) => state.features;

export const features = createSelector([getFeaturesState], (s) => {
  return sortFeatures(s.items);
});

export const sortFeatures = (ff: IFeature[]): IFeature[] => {
  return ff.sort(function (a, b) {
    return a.rank === b.rank ? 0 : +(a.rank > b.rank) || -1;
  });
};

export const filterFeaturesOnMilestoneAndSubWorkflow = (
  ff: IFeature[],
  milestoneId: string,
  subWorkflowId: string
) => {
  return ff
    .filter((f) => f.milestoneId === milestoneId)
    .filter((x) => x.subWorkflowId === subWorkflowId);
};

export const filterFeaturesOnSubWorkflow = (
  ff: IFeature[],
  subWorkflowId: string
) => {
  return ff.filter((x) => x.subWorkflowId === subWorkflowId);
};

export const filterFeaturesOnMilestone = (
  ff: IFeature[],
  milestoneId: string
) => {
  return ff.filter((f) => f.milestoneId === milestoneId);
};

export const getFeature = (ff: IFeature[], id: string) => {
  return ff.find((f) => f.id === id)!;
};
