function MessageBody({ text }: { text: string }) {
  return (
    <div
      className="prose prose-invert max-w-prose break-words"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
export default MessageBody;
