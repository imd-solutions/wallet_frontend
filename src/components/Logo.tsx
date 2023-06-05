import Image from 'mui-image';
import { Box, SxProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  width: string;
  height: string;
  sx?: SxProps;
  logoColour?: 'black' | 'mixed';
}

const Logo = ({
  width = '100px',
  height = '100px',
  logoColour = 'mixed',
  sx,
}: LogoProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ cursor: 'pointer', ...sx }} onClick={() => navigate('/')}>
      {logoColour === 'mixed' ? (
        <Image
          src="../images/KamaPay.png"
          width={width || '100px'}
          height={height || '100px'}
        />
      ) : (
        <Image
          src="../images/KamaPay_Black.png"
          width={width || '100px'}
          height={height || '100px'}
        />
      )}
    </Box>
  );
};

export default Logo;
