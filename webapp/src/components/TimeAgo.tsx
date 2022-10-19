import { FunctionComponent } from "react";

type TimeAgoProps = {
  date: string;
};

const DAY_IN_MILLISECONDS = 86_400_000;
const HOUR_IN_MILLISECONDS = 3_600_000;
const MINUTE_IN_MILLISECONDS = 60_000;

export const daysToReadableString = (date: string) => {
  const diffInMilliseconds = new Date(date).getTime() - new Date().getTime();
  const days = Math.ceil(diffInMilliseconds / DAY_IN_MILLISECONDS);
  const hours = Math.ceil(diffInMilliseconds / HOUR_IN_MILLISECONDS);
  const minutes = Math.ceil(diffInMilliseconds / MINUTE_IN_MILLISECONDS);

  if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  }

  return `${days}d`;
};

export const TimeAgo: FunctionComponent<Readonly<TimeAgoProps>> = ({
  date,
}) => {
  let content: string | null = null;
  try {
    content = daysToReadableString(date);
  } catch (error) {}

  if (content === null) return null;

  return (
    <time dateTime={date} title={date}>
      {content} ago
    </time>
  );
};
