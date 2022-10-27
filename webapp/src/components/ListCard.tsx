export const ListCard: React.FunctionComponent<React.PropsWithChildren> = (
  props
) => {
  const { children } = props;
  return (
    <div className="flex grow basis-96 flex-col rounded bg-white p-4 shadow-lg">
      {children}
    </div>
  );
};
