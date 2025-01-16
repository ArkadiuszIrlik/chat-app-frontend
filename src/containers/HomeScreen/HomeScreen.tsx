import { useMediaQuery } from '@uidotdev/usehooks';
import styleConsts from '@constants/styleConsts';
import ButtonPanel from '@containers/HomeScreen/ButtonPanel';
import CTABar from '@containers/HomeScreen/CTABar';
import { HeaderLarge, HeaderSmall } from '@containers/HomeScreen/Header';

function HomeScreen() {
  const isSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.sm}`,
  );

  return (
    <div className="min-h-dvh">
      {isSmallScreen ? <HeaderLarge /> : <HeaderSmall />}
      {isSmallScreen ? (
        <CTABar />
      ) : (
        <div className="relative mb-20 mt-10">
          <ButtonPanel />
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
