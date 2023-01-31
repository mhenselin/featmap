import { Tag } from "./Tag";

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
    <Tag tooltip={tooltip}>
      {icon && (
        <i className="material-icons align-middle text-base text-gray-700">
          {icon}
        </i>
      )}
      {text}
    </Tag>
  );
};
