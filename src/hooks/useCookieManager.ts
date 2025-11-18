import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const defaultCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
};

const getExpireDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const setCookiesInternal = (accessToken: string, refreshToken: string) => {
  const options = {
    ...defaultCookieOptions,
    expires: getExpireDate(),
  };
  cookies.set('accessToken', accessToken, options);
  cookies.set('refreshToken', refreshToken, options);
};

const getCookiesInternal = () => ({
  accessToken: cookies.get('accessToken'),
  refreshToken: cookies.get('refreshToken'),
});

const removeCookiesInternal = () => {
  cookies.remove('accessToken', defaultCookieOptions);
  cookies.remove('refreshToken', defaultCookieOptions);
};

export const useCookieManager = () => ({
  setCookies: setCookiesInternal,
  getCookies: getCookiesInternal,
  removeCookies: removeCookiesInternal,
});

