import { Link } from "react-router-dom";
import { useApplicationData } from "../components/ApplicationContext";
import { CreateWorkspaceForm } from "../components/CreateWorkspaceForm";
import { Headline } from "../components/Headline";
import { Icon } from "../components/Icon";
import { ListCard } from "../components/ListCard";
import { ListWithSidebarLayout } from "../components/ListWithSidebarLayout";
import { OneColumnLayout } from "../components/OneColumnLayout";
import { TimeAgo } from "../components/TimeAgo";

export const Workspaces = () => {
  const applicationData = useApplicationData();

  return (
    <OneColumnLayout>
      <ListWithSidebarLayout
        headline="Workspaces"
        sidebar={<CreateWorkspaceForm />}
      >
        {applicationData.workspaces.map((workspace) => {
          return (
            <ListCard key={workspace.id}>
              <Headline level={2}>
                <Link
                  to={"/" + workspace.name}
                  className="focus flex items-center"
                >
                  {workspace.name}
                </Link>
              </Headline>
              <div className="flex items-center justify-between gap-8 text-sm">
                <span>
                  {`Created `}
                  <b>
                    <TimeAgo date={workspace.createdAt} />
                  </b>
                </span>
                <Link
                  to={"/" + workspace.name}
                  className="focus flex items-center"
                >
                  <Icon type="chevron_right" />
                  <span className="sr-only">Open workspace</span>
                </Link>
              </div>
            </ListCard>
          );
        })}
      </ListWithSidebarLayout>
    </OneColumnLayout>
  );
};
