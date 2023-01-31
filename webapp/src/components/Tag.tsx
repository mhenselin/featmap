type TagProps = React.PropsWithChildren<{
  tooltip?: string;
  type?: "danger" | "primary" | "none";
}>;

const typeStyles = {
  primary: "bg-indigo-200",
  none: "bg-gray-200",
  danger: "bg-red-200",
};

export const Tag: React.FunctionComponent<Readonly<TagProps>> = (props) => {
  const { tooltip, children, type = "none" } = props;

  return (
    <span
      title={tooltip}
      className={`flex gap-1 whitespace-nowrap rounded px-1 text-sm font-semibold uppercase text-black ${typeStyles[type]}`}
    >
      {children}
    </span>
  );
};
