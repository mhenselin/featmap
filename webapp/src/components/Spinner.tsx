export const Spinner = () => {
  return (
    <div
      className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
      role="status"
    >
      <span className="sr-only">waiting for response</span>
    </div>
  );
};
