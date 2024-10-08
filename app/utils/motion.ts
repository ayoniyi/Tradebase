export const overlayFunc = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
};
export const modalFunc = {
  hidden: {
    scale: 0.8,
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
    },
  },
  exit: {
    y: 100,
    scale: 0.5,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
export const createFunc = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,

    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
    },
  },
  exit: {
    y: -200,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
