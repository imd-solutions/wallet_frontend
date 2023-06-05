class TokenService {
  public token: string | null = null;

  isTokenExpired() {
    // use this.token and check against expiry
    return false;
  }
}

const tokenService = new TokenService();
export default tokenService;
