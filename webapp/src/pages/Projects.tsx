import { Link } from "react-router-dom";
import { useApplicationData } from "../components/ApplicationContext";
import { CreateProjectForm } from "../components/CreateProjectForm";
import { Headline } from "../components/Headline";
import { Icon } from "../components/Icon";
import { ListCard } from "../components/ListCard";
import { ListWithSidebarLayout } from "../components/ListWithSidebarLayout";
import { useProjectsData } from "../components/ProjectsContext";
import { TimeAgo } from "../components/TimeAgo";
import { useWorkspaceName } from "../components/WorkspaceContext";
import { Roles } from "../core/misc";
import {
  getMembership,
  getWorkspaceByName,
} from "../store/application/selectors";

export const Projects = () => {
  const applicationData = useApplicationData();
  const projectsData = useProjectsData();
  const workspaceName = useWorkspaceName();
  const workspace = getWorkspaceByName(applicationData, workspaceName)!;
  const member = getMembership(applicationData, workspace.id);
  const canCreateProjects = member.level !== Roles.VIEWER;

  return (
    <ListWithSidebarLayout
      headline="Projects"
      sidebar={canCreateProjects && <CreateProjectForm />}
    >
      {projectsData.map((project) => {
        return (
          <ListCard key={project.id}>
            <Headline level={2}>
              <Link
                to={`/${workspaceName}/projects/${project.id}`}
                className="focus flex items-center"
              >
                {project.title}
              </Link>
            </Headline>
            <p className="my-4 grow">{project.description}</p>
            <div className="flex items-center justify-between gap-8 text-sm">
              <span>
                {`Created `}
                <b>
                  <TimeAgo date={project.createdAt} />
                </b>
                {` by `}
                <b>{project.createdByName}</b>
              </span>
              <Link
                to={`/${workspaceName}/projects/${project.id}`}
                className="focus flex items-center"
              >
                <Icon type="chevron_right" />
                <span className="sr-only">Open project</span>
              </Link>
            </div>
          </ListCard>
        );
      })}
    </ListWithSidebarLayout>
  );
};
