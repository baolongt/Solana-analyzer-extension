import Markdown from 'react-markdown';
import React from 'react';

export const AIResponseText: React.FC<{ content: string }> = ({ content }) => {
  return <Markdown>{content}</Markdown>;
};
