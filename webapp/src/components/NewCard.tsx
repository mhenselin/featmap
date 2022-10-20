type NewCardProps = React.PropsWithChildren;

export const NewCard: React.FunctionComponent<NewCardProps> = (props) => {
  const { children } = props;
  return (
    <div className="h-24 w-36 items-center justify-center rounded-sm border border-dashed border-gray-300 p-1">
      <div className="flex h-full">{children}</div>
    </div>
  );
};
