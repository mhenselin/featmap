// TODO could probably be removed
type DimCardProps = React.PropsWithChildren;

export const DimCard: React.FunctionComponent<Readonly<DimCardProps>> = (
  props
) => {
  const { children } = props;
  return (
    <div className="flex h-24 w-40 items-center justify-center rounded border border-dashed border-gray-200 p-1 ">
      <div className="flex">{children}</div>
    </div>
  );
};
