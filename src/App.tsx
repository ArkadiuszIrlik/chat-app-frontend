import ChatScreen from '@containers/ChatScreen/ChatScreen';

function App() {
  return (
    <div className="bg-dark-900">
      <div
        className="mx-auto flex min-h-screen flex-col
       font-main lg:mx-[8%] xl:mx-[14%] 2xl:mx-auto 2xl:max-w-[1800px]"
      >
        <ChatScreen />
      </div>
    </div>
  );
}

export default App;
