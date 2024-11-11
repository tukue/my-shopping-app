
// Custom hook for managing lexical state
const useLex = (initialState) => {
  const [state, setState] = React.useState(initialState);

  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState
    }));
  };

  return [state, updateState];
};

export default useLex;