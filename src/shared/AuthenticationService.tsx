import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import decode from 'jwt-decode';
import qs from 'qs';


export interface IAuthentiactionService {
    setBaseUrl(url: string): void;
    getLoginUrl(): string;
    getLogoutUrl(): string;
    getAccountUrl(): string;
    login(username: string, password: string): Promise<void>;
    beginReset(email: string, returnUrl: string): Promise<void>;
    completeReset(password: string, passwordConfirm: string, resetId: string): Promise<void>;
    getCurrentUser(): ICurrentUser;
}

export interface ICurrentUser {
    emailAddress: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isInRole: (role: string) => boolean;
    settings: {} | null;
}

export interface IToken {
    access_token: string;
    refresh_token_expires: number;
}

export interface IJWTModel {
    exp: number;
}


let AUTH_BASE_URL = 'https://authentication.flexinets.se';
const STORAGE_KEY = 'react_token';

axios.defaults.validateStatus = (status) => status >= 200 && status < 500;
axios.interceptors.request.use(async (config) => AuthenticationService.authInterceptor(config));


let token: IToken | null = null;
let currentUser: ICurrentUser | null = null;
let refreshPromise: Promise<boolean> | null = null;

export default class AuthenticationService {
    static setBaseUrl(url: string) { AUTH_BASE_URL = url; }
    static getLoginUrl() { return `${AUTH_BASE_URL}/token`; }
    static getLogoutUrl() { return `${AUTH_BASE_URL}/logout`; }
    static getAccountUrl() { return `${AUTH_BASE_URL}/api/account/`; }


    static async login(username: string, password: string) {
        this.clearTokenContext();
        const response = await axios.post(this.getLoginUrl(), qs.stringify({
            grant_type: 'password',
            username: username,
            password: password,
        }));

        if (response.status === 200) {
            this.setJwtToken(response.data);
        }
        return response;
    }


    /**
     * Begin password reset for email
     * @param {string} email Email address
     * @param {string} returnUrl Domain part of return url
     */
    static async beginReset(email: string, returnUrl: string) {
        const response = await axios({
            method: 'post',
            url: this.getAccountUrl() + 'resetpassword/beginreset/',
            data: {
                EmailAddress: email,
                ReturnUrl: returnUrl,
            },
        });
        return response;
    }


    /**
     * Complete a password reset request
     * @param {string} password New password
     * @param {string} passwordConfirm Confirm new password
     * @param {string} resetId  resetId
     */
    static async completeReset(password: string, passwordConfirm: string, resetId: string) {
        return await axios({
            method: 'post',
            url: this.getAccountUrl() + 'resetpassword/completereset/',
            data: {
                password: password,
                passwordConfirm: passwordConfirm,
                resetId: resetId,
            },
        });
    }


    /**
     * Validate a reset token
     * @param {string} resetId Reset id to validate
     */
    static async validateResetToken(resetId: string) {
        return await axios.get(`${this.getAccountUrl()}resetpassword/validateresettoken/${resetId}`);
    }


    /**
     * Authinterceptor for axios
     * @param {*} config axios config
     */
    static async  authInterceptor(config: AxiosRequestConfig) {
        if (config.url) {
            // With credentials must be enabled for requests to login and logout url, because the refresh token is stored as an http only cookie
            if (config.url.indexOf(this.getLoginUrl()) >= 0 || config.url.indexOf(this.getLogoutUrl()) >= 0) {
                console.debug('withCredentials enabled for request');
                config.withCredentials = true;
            } else {
                const accessToken = await this.getRefreshedAccessToken();
                if (accessToken !== null) {
                    config.headers.authorization = `Bearer ${accessToken}`;
                }
            }
        }

        return config;
    }


    static async  logout(): Promise<void> {
        this.clearTokenContext();
        await axios.post(this.getLogoutUrl());
        console.debug('Logged out');
    }


    /**
     * Check if a user is logged in.
     * Assumed to be logged in if a token exists, and the refresh token has not expired
     * @returns {boolean} True if use is logged in
     */
    static isLoggedIn(): boolean {
        const jwtToken = this.getJwtToken();
        return jwtToken !== null && jwtToken.refresh_token_expires > new Date().getTime() / 1000;
    }


    /**
     * Get the currently logged in user from somewhere
     * @returns {object} Returns the logged in user
     */
    static getCurrentUser(): ICurrentUser | null {
        if (currentUser === null) {
            const jwtToken = this.getJwtToken();
            if (jwtToken !== null) {
                try {
                    const claims = decode(jwtToken.access_token);
                    currentUser = {
                        emailAddress: 'foo', // claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                        firstName: 'bar', // claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
                        lastName: 'herp', // claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
                        roles: ['GlobalAdmin'], // claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                        isInRole: function (role) { return this.roles.indexOf(role) >= 0; },
                        settings: {},
                    };
                } catch (error) {
                    console.debug('unable to parse token');
                }
            }
        }
        return currentUser;
    }


    /**
     * Get an access token which has been refreshed if expired
     */
    static async getRefreshedAccessToken(): Promise<string | null> {
        let jwtToken = this.getJwtToken();
        try {
            if (jwtToken !== null) {
                if (this.isJwtTokenExpired(jwtToken.access_token)) {
                    console.debug('Token has expired, start refresh maybe');
                    const result = await this.refreshAccessToken();
                    console.debug(`token refresh result ${result}`);
                }

                jwtToken = this.getJwtToken();
                if (jwtToken) {
                    return jwtToken.access_token;
                }
            }
        } catch (error) {
            console.debug(error);
            this.clearTokenContext();
        }
        return null;
    }


    /**
     * Check if an email address is available for an admin account
     * @param {string} email Email address
     */
    static async checkEmailAvailability(email: string) {
        const response = await axios.get(`${AUTH_BASE_URL}/api/checkemailavailability?email=${email}`);
        return response.data.available;
    }



    /**
     * Save the token to localStorage
     * @param {JSON} jwtTokenJson JWT token
     */
    static setJwtToken(jwtTokenJson: IToken) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jwtTokenJson));
        token = jwtTokenJson;
    }


    /**
     * Get the token from localStorage or variable if available
     * @returns {JSON} JWT token
     */
    static getJwtToken(): IToken | null {
        if (token === null) {
            console.debug('getting token from localstorage');
            const tokenJson = localStorage.getItem(STORAGE_KEY);
            if (tokenJson) {
                token = JSON.parse(tokenJson);
            }
        }
        return token;
    }


    /**
     * Refresh access token
     */
    static async refreshAccessToken() {
        console.debug('Refreshing access token');

        if (refreshPromise === null) {
            console.debug('No pending access token refresh, starting new');
            refreshPromise = axios.post(this.getLoginUrl(), qs.stringify({ grant_type: 'refresh_token' })).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    console.debug('Refreshed access token');
                    this.setJwtToken(response.data);
                    return true;
                }
                this.clearTokenContext();
                return false;
            }).catch((error) => {
                console.debug(error);
                this.clearTokenContext();
                return false;
            }).finally(() => refreshPromise = null);
        }

        return refreshPromise;
    }


    /**
     * Clear the local token context
     */
    static clearTokenContext(): void {
        console.debug('clearing token context');
        localStorage.removeItem(STORAGE_KEY);
        token = null;
        currentUser = null;
    }


    /**
     * Check if an access token has expired
     * @param {string} jwtTokenString JWT token
     * @returns {boolean} True if access token has not expired
     */
    static isJwtTokenExpired(jwtTokenString: string): boolean {
        const jwtToken = decode(jwtTokenString) as IJWTModel;
        if (!jwtToken.exp) {
            return true;
        }

        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(jwtToken.exp);

        return expirationDate < new Date();
    }
}
