- [x] remove stripe 10m
- integrate tailwind to remove tailwind.min.css link from index.html
- follow knip findings: 1h
```text
--- UNUSED FILES (2)
src/core/lexorank.test.tsx
src/react-app-env.d.ts

--- UNUSED DEPENDENCIES (13)
@types/history
@types/react-beautiful-dnd
@types/react-dom
@types/react-onclickoutside
@types/react-redux
@types/react-router
@types/react-router-dom
@types/react-timeago
@types/uuid
@types/yup
react-scripts
stripe
typescript

--- UNLISTED DEPENDENCIES (0)
Not found

--- UNUSED EXPORTS (22)
API_CHANGE_ALLOW_EXTERNAL_SHARING  src/api/index.ts
submit                             src/components/CreateProjectModal.tsx
OldButton                          src/components/elements.tsx
history                            src/configureStore.ts
countries                          src/core/misc.ts
subIsProOrAbove                    src/core/misc.ts
annotationsToEnums                 src/core/misc.ts
annotationsFromNames               src/core/misc.ts
Annotations                        src/core/misc.ts
deleteMessageAction                src/store/application/actions.ts
createMessageAction                src/store/application/actions.ts
getAccount                         src/store/application/selectors.ts
getFeatureComment                  src/store/featurecomments/selectors.ts
sortFeatureComments                src/store/featurecomments/selectors.ts
closedFeatures                     src/store/features/selectors.ts
createProjectRequest               src/store/projects/actions.ts
loadProjectsRequest                src/store/projects/actions.ts
sortProjectsByCreateDate           src/store/projects/selectors.ts
sortProjects                       src/store/projects/selectors.ts
getNbrOfClosedSubWorkflows         src/store/subworkflows/selectors.ts
updateWorkflowPersonaAction        src/store/workflowpersonas/actions.ts
getWorkflowPersona                 src/store/workflowpersonas/selectors.ts

--- UNUSED EXPORTS IN NAMESPACE (10)
register                 src/serviceWorker.ts
applicationInitialState  src/store/application/reducers.ts
initialState             src/store/featurecomments/reducers.ts
initialState             src/store/features/reducers.ts
milestonesInitialState   src/store/milestones/reducers.ts
initialState             src/store/personas/reducers.ts
initialState             src/store/projects/reducers.ts
initialState             src/store/subworkflows/reducers.ts
initialState             src/store/workflowpersonas/reducers.ts
initialState             src/store/workflows/reducers.ts

--- UNUSED TYPES (56)
API_GET_PROJECTS_RESP           interface  src/api/index.ts
Actions                         type       src/components/CreateCardModal.tsx
newFeature                      interface  src/components/CreateCardModal.tsx
newSubWorkflow                  interface  src/components/CreateCardModal.tsx
newWorkflow                     interface  src/components/CreateCardModal.tsx
newMilestone                    interface  src/components/CreateCardModal.tsx
Actions                         type       src/components/Personas.tsx
newFeature                      interface  src/components/Personas.tsx
newSubWorkflow                  interface  src/components/Personas.tsx
newWorkflow                     interface  src/components/Personas.tsx
newMilestone                    interface  src/components/Personas.tsx
Types                           enum       src/components/Personas.tsx
Annotation                      interface  src/core/misc.ts
Annotation2                     enum       src/core/misc.ts
deleteMessage                   interface  src/store/application/actions.ts
createMessage                   interface  src/store/application/actions.ts
resetApp                        interface  src/store/application/actions.ts
receiveApp                      interface  src/store/application/actions.ts
deleteFeatureComment            interface  src/store/featurecomments/actions.ts
updateFeatureComment            interface  src/store/featurecomments/actions.ts
loadFeatureComments             interface  src/store/featurecomments/actions.ts
createFeatureComment            interface  src/store/featurecomments/actions.ts
moveFeature                     interface  src/store/features/actions.ts
deleteAllFeaturesBySubWorkflow  interface  src/store/features/actions.ts
deleteAllFeaturesByMilestone    interface  src/store/features/actions.ts
deleteFeature                   interface  src/store/features/actions.ts
updateFeature                   interface  src/store/features/actions.ts
loadFeatures                    interface  src/store/features/actions.ts
createFeature                   interface  src/store/features/actions.ts
moveMilestone                   interface  src/store/milestones/actions.ts
deleteMilestone                 interface  src/store/milestones/actions.ts
updateMilestone                 interface  src/store/milestones/actions.ts
loadMilestones                  interface  src/store/milestones/actions.ts
createMilestone                 interface  src/store/milestones/actions.ts
deletePersona                   interface  src/store/personas/actions.ts
updatePersona                   interface  src/store/personas/actions.ts
loadPersonas                    interface  src/store/personas/actions.ts
createPersona                   interface  src/store/personas/actions.ts
deleteProject                   interface  src/store/projects/actions.ts
updateProject                   interface  src/store/projects/actions.ts
loadProjects                    interface  src/store/projects/actions.ts
createProject                   interface  src/store/projects/actions.ts
moveSubWorkflow                 interface  src/store/subworkflows/actions.ts
deleteSubWorkflow               interface  src/store/subworkflows/actions.ts
updateSubWorkflow               interface  src/store/subworkflows/actions.ts
loadSubWorkflows                interface  src/store/subworkflows/actions.ts
createSubWorkflow               interface  src/store/subworkflows/actions.ts
deleteWorkflowPersona           interface  src/store/workflowpersonas/actions.ts
updateWorkflowPersona           interface  src/store/workflowpersonas/actions.ts
loadWorkflowPersonas            interface  src/store/workflowpersonas/actions.ts
createWorkflowPersona           interface  src/store/workflowpersonas/actions.ts
moveWorkflow                    interface  src/store/workflows/actions.ts
deleteWorkflow                  interface  src/store/workflows/actions.ts
updateWorkflow                  interface  src/store/workflows/actions.ts
loadWorkflows                   interface  src/store/workflows/actions.ts
createWorkflow                  interface  src/store/workflows/actions.ts

--- UNUSED TYPES IN NAMESPACE (0)
Not found

--- DUPLICATE EXPORTS (6)
reducer, applicationReducer     src/store/application/reducers.ts
reducer, milestonesReducer      src/store/milestones/reducers.ts
reducer, personaReducer         src/store/personas/reducers.ts
reducer, subWorkflowReducer     src/store/subworkflows/reducers.ts
reducer, workflowPersonaReducer src/store/workflowpersonas/reducers.ts
reducer, workflowsReducer       src/store/workflows/reducers.ts
```

- timeago rechnet nur eine time differenz aus ... das können wir ersetzen 1h
- [x] history and connected react router can be safely removed 10m
- remove subscription related pages/code (pricing, subscriptionpage, ) 1h
- creates uuid in browser for optimisitic state update > change this to not use uuid, we could use useId() or some math.Random string generation instead 1h
- improve eslint, typescript and prettier 3h
- create pipeline and project setup in azure 3h
- package upgrades 4h
  - remove typesafe actions... upgrade to latest redux or probably toolkit will help ? 2d



  2d basic fixes/upgrades/unused code removals OR LESS but not more
  ~2d => redux upgrade to redux toolkit
  OR modernize code base from classes to functions 3-5d (completly remove redux and use useState)