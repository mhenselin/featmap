type StatusProps = {
  tooltip?: string;
  icon?: string;
  text?: string | number;
  shouldRender?: boolean;
};

export const CardFlag: React.FunctionComponent<StatusProps> = (props) => {
  const { tooltip, icon, text, shouldRender = true } = props;

  if (!shouldRender) return null;

  return (
    <div className="whitespace-nowrap bg-gray-200" title={tooltip}>
      {icon && (
        <i className="material-icons mr-1.5 align-middle text-gray-700">
          {icon}
        </i>
      )}
      {text}
    </div>
  );
};
