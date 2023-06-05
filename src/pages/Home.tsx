import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, CardActions, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import {
  AddCircleRounded,
  SettingsOutlined,
  PowerSettingsNew,
  SvgIconComponent,
} from '@mui/icons-material';
import MidWrapper from 'components/MidWrapper';
import { usePageBackground } from 'hooks/usePageBackground';
import { useDispatch } from 'store';
import { logout } from 'store/auth';
import Balance from 'components/Balance';
import Transactions from 'components/Transactions';

interface MenuType {
  to: () => void;
  Icon: SvgIconComponent;
  label: string;
}

const MenuButton = ({
  to,
  Icon,
  label,
}: {
  to: () => void;
  Icon: SvgIconComponent;
  label: string;
}) => {
  return (
    <Card
      sx={({ palette }) => ({
        width: 'calc(50% - 1.5em)',
        mb: 4,
        backgroundColor: palette.common.black,
        '&:focus, &:hover': {
          backgroundColor: grey[900],
          '& > .MuiCardContent-root .icon-div': {
            transform: 'scale(1.3)',
          },
        },
      })}
    >
      <CardContent
        onClick={to}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 100, md: 200 },
          '&:focus, &:hover': { cursor: 'pointer' },
        }}
      >
        <Box
          component="div"
          className="icon-div"
          sx={({ palette }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            borderRadius: '50%',
            border: `5px solid ${palette.common.white}`,
            width: { xs: 50, md: 100 },
            height: { xs: 50, md: 100 },
            p: 1,
          })}
        >
          <Icon
            sx={({ palette }) => ({
              width: { xs: 50, md: 100 },
              height: { xs: 50, md: 100 },
              color: grey[100],
            })}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ p: 0 }}>
        <Button
          type="button"
          variant="text"
          onClick={to}
          sx={({ palette }) => ({
            borderRadius: 0,
            color: palette.common.black,
            width: '100%',
            height: '100%',
            backgroundColor: grey[50],
            '&:focus, &:hover': {
              backgroundColor: grey[200],
              color: palette.common.black,
            },
          })}
        >
          {label}
        </Button>
      </CardActions>
    </Card>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  usePageBackground(grey[50]);

  const menus: MenuType[] = [
    {
      to: () => navigate('/topUp'),
      Icon: AddCircleRounded,
      label: 'Top Up',
    },
    {
      to: () => navigate('/settings'),
      Icon: SettingsOutlined,
      label: 'Settings',
    }
  ];

  return (
    <MidWrapper>
      <Balance />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexFlow: 'row wrap',
          mt: 2
        }}
      >
        {menus.map((m) => (
          <MenuButton key={m.label} {...m} />
        ))}
      </Box>
    </MidWrapper>
  );
};

export default Home;
