import { Container } from "./Container";

type OneColumnLayoutProps = React.PropsWithChildren;

export const OneColumnLayout: React.FunctionComponent<
  Readonly<OneColumnLayoutProps>
> = (props) => {
  const { children } = props;
  return (
    <div className="min-h-screen bg-gray-100">
      <Container as="main">{children}</Container>
    </div>
  );
};
