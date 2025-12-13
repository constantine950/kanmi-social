export interface Feature {
  text: string;
  title: string;
}

export interface featureProps {
  i: number;
  card: Feature;
}

export interface Mockpost {
  id: number;
  username: string;
  content: string;
}

export interface MockPostProp {
  post: Mockpost;
}
