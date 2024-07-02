import React, { ComponentProps, FC, memo } from 'react';
// import { type MDXComponents } from 'mdx/types';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: any = {
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1
      className={`mt-2 flex w-full items-center gap-1 text-sm font-extrabold tracking-tight whitespace-normal ${className}`}
      {...props}
    />
  ),
  // more components + custom components
};

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.className === nextProps.className,
);

export default function RenderMessage({ children }: { children: string }) {
  return (
    <ErrorBoundary fallback={<div className="whitespace-pre-wrap">{children}</div>}>
      <MemoizedReactMarkdown components={components} remarkPlugins={[remarkGfm /* additional plugins */]}>
        {children}
      </MemoizedReactMarkdown>
    </ErrorBoundary>
  );
}
