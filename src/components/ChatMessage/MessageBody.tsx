function MessageBody({ text }: { text: string }) {
  return (
    <div
      className="prose max-w-prose break-words dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
export default MessageBody;
