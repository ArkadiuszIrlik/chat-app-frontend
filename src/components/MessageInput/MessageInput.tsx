import { useEffect, useRef, useState } from 'react';
import SendIcon from '@assets/send.png';

function MessageInput() {
  const [text, setText] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  function calculateMaxHeight() {
    if (divRef.current) {
      const { lineHeight, paddingTop, paddingBottom, borderTop, borderBottom } =
        window.getComputedStyle(divRef.current);
      const nextMaxHeight =
        (parseInt(lineHeight, 10) || 0) * 5 +
        (parseInt(paddingBottom, 10) || 0) +
        (parseInt(paddingTop, 10) || 0) +
        (parseInt(borderBottom, 10) || 0) +
        (parseInt(borderTop, 10) || 0);
      setMaxHeight(`${nextMaxHeight}px`);
    }
  }

  useEffect(() => {
    function handleResize() {
      calculateMaxHeight();
    }
    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    calculateMaxHeight();
  }, [divRef]);

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="grid grow rounded-lg bg-dark-600 p-5 outline-1 outline-white focus-within:outline">
        <textarea
          rows={1}
          placeholder="Type your message..."
          className="scrollbar-none col-start-1 row-start-1 resize-none
           overflow-y-scroll break-words bg-dark-600 text-white outline-none
            placeholder:text-dark-500"
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
          }}
        />
        <div
          ref={divRef}
          style={{ maxHeight }}
          className="scrollbar-none invisible col-start-1 row-start-1 overflow-y-scroll break-words"
        >
          {text}
        </div>
      </div>
      <div className="aspect-square h-12">
        <div className="rounded-lg bg-primary-600 p-3">
          <img src={SendIcon} alt="" className="brightness-0 invert" />
        </div>
      </div>
    </div>
  );
}
export default MessageInput;
