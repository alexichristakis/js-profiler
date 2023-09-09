import useMountEffect from "./useMountEffect";

const getWindowSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const useWindowSize = (
  onChange: (windowSize: ReturnType<typeof getWindowSize>) => void
) => {
  useMountEffect(() => {
    const onResize = () => onChange(getWindowSize());

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  });
};

export default useWindowSize;
