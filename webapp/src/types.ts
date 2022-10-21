export type WithHTMLProps<
  T extends React.ElementType,
  P = Record<string, unknown>
> = React.ComponentPropsWithoutRef<T> & P;
