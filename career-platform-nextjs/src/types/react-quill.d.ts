import { ComponentType } from 'react';

declare module 'react-quill' {
  export interface QuillOptions {
    theme?: string;
    modules?: {
      toolbar: any[];
      history?: {
        delay: number;
        maxStack: number;
        userOnly: boolean;
      };
    };
    formats?: string[];
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    debug?: string | boolean;
    placeholder?: string;
    readOnly?: boolean;
    preserveWhitespace?: boolean;
  }

  interface UnprivilegedEditor {
    getLength(): number;
    getText(index?: number, length?: number): string;
    getHTML(): string;
    getBounds(index: number, length?: number): any;
    getSelection(focus?: boolean): { index: number; length: number };
    getContents(index?: number, length?: number): any;
  }

  interface ReactQuillProps extends QuillOptions {
    id?: string;
    value: string;
    defaultValue?: string;
    onChange?: (content: string, delta: any, source: any, editor: UnprivilegedEditor) => void;
    onChangeSelection?: (range: any, source: any, editor: UnprivilegedEditor) => void;
    onFocus?: (range: any, source: any, editor: UnprivilegedEditor) => void;
    onBlur?: (previousRange: any, source: any, editor: UnprivilegedEditor) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    className?: string;
    style?: React.CSSProperties;
    ref?: any;
  }

  interface Quill {
    import: (path: string) => any;
    getModule: (name: string) => any;
    getEditor: () => any;
    history: {
      undo: () => void;
      redo: () => void;
    };
  }

  const ReactQuill: ComponentType<ReactQuillProps> & { Quill: Quill };
  export default ReactQuill;
}
