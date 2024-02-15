import ChatScreen from '@containers/ChatScreen/ChatScreen';
import useSocketStatus from '@hooks/useSocketStatus';

function App() {
  const isSocketConnected = useSocketStatus();
  return (
    <div className="bg-gray-800">
      <div
        className="mx-auto flex min-h-screen flex-col overflow-hidden font-ui
       text-white lg:mx-[8%] xl:mx-[14%] 2xl:mx-auto 2xl:max-w-[1800px]"
      >
        <ChatScreen />
        <p className="text-white">
          {isSocketConnected ? 'Connected' : 'Not Connected'}
        </p>
      </div>
    </div>
  );
}

export default App;
