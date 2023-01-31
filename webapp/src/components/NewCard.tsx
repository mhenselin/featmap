type NewCardProps = React.PropsWithChildren;

export const NewCard: React.FunctionComponent<NewCardProps> = (props) => {
  const { children } = props;
  return (
    <div className="h-24 w-40 items-center justify-center rounded border border-gray-300 bg-gray-200 shadow-inner">
      <div className="flex h-full w-full items-center justify-center text-sm">
        {children}
      </div>
    </div>
  );
};
