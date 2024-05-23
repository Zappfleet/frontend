import classNames from "classnames";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};
// border-primary
export const SmallLoader = (props: any) => {
  return (
    <div className={classNames("flex items-center justify-center p-10", props.className)}>
      <div className={classNames(
        "h-10 w-10 animate-spin rounded-full border-2 border-solid border-t-transparent",
        {
          "border-primary": props.color == null,
          [`border-[${props.color}]`]: props.color != null && props.color.startsWith("#"),
          [`border-${props.color}`]: props.color != null && !props.color.startsWith("#"),
        }
      )}></div>
    </div>
  );
}

export default Loader;
