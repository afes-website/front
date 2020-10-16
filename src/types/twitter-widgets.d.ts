declare module "twitter-widgets" {
  function load(callback?: () => void): void;
}

interface Window {
  twttr: {
    widgets: {
      load: () => void;
    };
  };
}
