import PhoneImage from '@assets/phone-placeholder.svg';
import LaptopImage from '@assets/laptop-placeholder.svg';
import ButtonPanel from '@containers/HomeScreen/ButtonPanel';

function CTABar() {
  return (
    <div className="mt-20 bg-gray-700">
      <div className="flex items-center justify-between py-5 sm:px-8 md:px-16">
        <div className="flex items-center gap-12 py-3 sm:w-1/2 md:w-1/3">
          <img
            src={LaptopImage}
            alt=""
            className="visual-search-none w-[73%] select-none saturate-[70%]"
            draggable="false"
          />
          <img
            src={PhoneImage}
            alt=""
            className="visual-search-none w-[27%] select-none saturate-[70%]"
            draggable="false"
          />
        </div>
        <div>
          <p className="mb-4 text-center text-2xl text-white">
            Get chatting now
          </p>
          <ButtonPanel />
        </div>
      </div>
    </div>
  );
}

export default CTABar;
