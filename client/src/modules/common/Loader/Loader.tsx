import Lottie from 'lottie-react';

import loadingAnimation from '../../../assets/lottie/mobileLoader.json';

const Loader = () => {
  return (
    <Lottie
      animationData={loadingAnimation}
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    />
  );
};

export default Loader;
