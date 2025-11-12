import { Img } from '@react-email/components';

import { DEFAULT_WORKSPACE_LOGO } from '../constants/DefaultWorkspaceLogo';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src="https://mobius-dev.drived.dev/images/icons/android/android-launchericon-192-192.png"
      alt="Mobius logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
