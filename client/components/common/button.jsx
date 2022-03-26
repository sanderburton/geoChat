export const Button = ({ children, ...other }) => {
  return (
    <button className="my-button left-margin" {...other}>
      {children}
    </button>
  );
};
