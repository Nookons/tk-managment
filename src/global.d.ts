
declare module '*.module.css' {
    const classes: { [key: string]: string };  // Тип для классов, экспортируемых из CSS-модуля
    export default classes;
}

// Декларация для .jpg файлов
declare module '*.jpg' {
    const value: string;
    export default value;
}

// Декларация для .jpeg файлов
declare module '*.jpeg' {
    const value: string;
    export default value;
}

// Декларация для .webp файлов
declare module '*.webp' {
    const value: string;
    export default value;
}

// Декларация для .png файлов
declare module '*.png' {
    const value: string;
    export default value;
}

// Декларация для .svg файлов (если нужно)
declare module '*.svg' {
    const content: string;
    export default content;
}

declare module 'js-cookie' {
    const Cookies: {
        get: (key: string) => string | undefined;
        set: (key: string, value: string, options?: object) => void;
        remove: (key: string, options?: object) => void;
    };
    export default Cookies;
}


// src/types/react-input-mask.d.ts
declare module 'react-input-mask' {
    import * as React from 'react';

    export interface ReactInputMaskProps {
        mask: string;
        value?: string;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
        onBlur?: React.FocusEventHandler<HTMLInputElement>;
        onFocus?: React.FocusEventHandler<HTMLInputElement>;
        [key: string]: any; // Это позволяет передавать другие свойства
    }

    export default function InputMask(props: ReactInputMaskProps): JSX.Element;
}

