import React from 'react';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import Logo from 'components/Logo';
import { logout } from 'store/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';

enum PageLinkType {
  Navigate = 'navigate',
  Button = 'button',
}

interface PageLink {
  label: string;
  to: string | ActionCreatorWithoutPayload;
  type: PageLinkType;
}

const pages = [
  {
    label: 'Home',
    to: '/',
    type: PageLinkType.Navigate,
  },
];

const settings = [
  {
    label: 'TopUp',
    to: '/topUp',
    type: PageLinkType.Navigate,
  },
  {
    label: 'Account',
    to: '/settings',
    type: PageLinkType.Navigate,
  },
  {
    label: 'Logout',
    to: logout,
    type: PageLinkType.Button,
  },
];

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClick = (page: PageLink) => {
    if (page.type === PageLinkType.Navigate) navigate(page.to as string);
    else dispatch((page.to as ActionCreatorWithoutPayload<string>)());
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#e1a408', zIndex: '1' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo
            width="70px"
            height="70px"
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 4 }}
            logoColour="black"
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                sx={{
                  marginBottom: 2,
                  marginTop: 2,
                  color: theme.palette.common.black,
                  display: 'block',
                  fontWeight: theme.typography.fontWeightBold,
                }}
                type="button"
                onClick={() => handleClick(page)}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: theme.palette.common.black }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={() => handleClick(page)}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Logo
              width="70px"
              height="70px"
              sx={{ ml: theme.spacing(4) }}
              logoColour="black"
            />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircle
                  sx={(theme) => ({ color: theme.palette.common.black })}
                  fontSize="large"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: 5 }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() => handleClick(setting)}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
