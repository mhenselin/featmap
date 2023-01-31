import * as fromFeatures from "./features/reducers";
import * as fromFeatureComments from "./featurecomments/reducers";
import * as fromWorkflows from "./workflows/reducers";
import * as fromSubWorkflows from "./subworkflows/reducers";
import * as fromMilestones from "./milestones/reducers";
import * as fromApplication from "./application/reducers";
import * as fromPersonas from "./personas/reducers";
import * as fromWorkflowPersonas from "./workflowpersonas/reducers";

import { combineReducers } from "redux";

import { Actions as ApplicationActions } from "./application/actions";
import { Actions as FeaturesActions } from "./features/actions";
import { Actions as MilestonesActions } from "./milestones/actions";
import {
  Actions as WorkflowsActions,
  Actions as SubworkflowsActions,
} from "./workflows/actions";
import { Actions as PersonaActions } from "./personas/actions";

export type AppState = {
  features: fromFeatures.State;
  featureComments: fromFeatureComments.State;
  workflows: fromWorkflows.State;
  subWorkflows: fromSubWorkflows.State;
  milestones: fromMilestones.State;
  application: fromApplication.State;
  personas: fromPersonas.State;
  workflowPersonas: fromWorkflowPersonas.State;
};

export const reducer = () =>
  combineReducers<AppState>({
    features: fromFeatures.reducer,
    featureComments: fromFeatureComments.reducer,
    workflows: fromWorkflows.reducer,
    subWorkflows: fromSubWorkflows.reducer,
    milestones: fromMilestones.reducer,
    application: fromApplication.reducer,
    personas: fromPersonas.reducer,
    workflowPersonas: fromWorkflowPersonas.reducer,
  });

export type AllActions =
  | ApplicationActions
  | FeaturesActions
  | MilestonesActions
  | WorkflowsActions
  | SubworkflowsActions
  | PersonaActions;
