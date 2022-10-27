import { Container } from "./Container";
import { Footer } from "./Footer";
import { Header, HeaderProps } from "./Header";

type OneColumnLayoutProps = React.PropsWithChildren<
  Pick<HeaderProps, "workspaceName">
>;

export const OneColumnLayout: React.FunctionComponent<
  Readonly<OneColumnLayoutProps>
> = (props) => {
  const { children, workspaceName } = props;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header workspaceName={workspaceName} />
      <Container className="grow" as="main">
        {children}
      </Container>
      <Footer />
    </div>
  );
};
