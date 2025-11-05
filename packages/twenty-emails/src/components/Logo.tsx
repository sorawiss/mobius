import { Img } from '@react-email/components';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src="https://app.mobius.com/images/icons/windows11/Square150x150Logo.scale-100.png"
      alt="Mobius logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
