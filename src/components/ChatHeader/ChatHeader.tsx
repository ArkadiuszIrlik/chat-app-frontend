function ChatHeader({ userName }: { userName: string }) {
  return (
    <div className="border-b-2 border-[#2C2C2C] px-4 py-2">
      <h2 className="text-xl text-white">{userName}</h2>
    </div>
  );
}
export default ChatHeader;
