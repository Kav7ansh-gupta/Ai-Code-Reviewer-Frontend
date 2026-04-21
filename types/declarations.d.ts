declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const atomDark: any;
  export const prism: any;
  // Add other styles as needed or use a wildcard
  const styles: any;
  export default styles;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark' {
  const style: any;
  export default style;
}

declare module 'react-simple-code-editor' {
  import { Component, ReactNode, TextareaHTMLAttributes } from 'react';

  export interface EditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onValueChange: (value: string) => void;
    highlight: (value: string) => string | ReactNode;
    padding?: number | string;
    insertSpaces?: boolean;
    tabSize?: number;
    ignoreTabKey?: boolean;
  }

  export default class Editor extends Component<EditorProps> {}
}
