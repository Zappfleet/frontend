import React, { useEffect } from 'react';
import axios from 'axios';
import { NotificationController } from '../../../lib/notificationController';
import { storeTokens } from '../../../pages/Authentication/utils';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import { getApiClient } from '../../../apis/client';


const LoginWithIrisa = (props: any) => {

    const data = JSON.parse(`
        {
          "tokenAttributes": {
            "sub": "f0a3d1f2-9a9f-44bd-8e28-8e407c76f73e",
            "resource_access": {
              "rahbord_client": {
                "roles": [
                  "rahbord_workspace_client_role"
                ]
              },
              "account": {
                "roles": [
                  "manage-account",
                  "manage-account-links",
                  "view-profile"
                ]
              }
            },
            "email_verified": false,
            "allowed-origins": [
              "*"
            ],
            "iss": "https://em-stage.irisaco.com/oauth/realms/irisa",
            "typ": "Bearer",
            "preferred_username": "co.ghanbari",
            "given_name": "Sedighe",
            "sid": "115a9ee2-ef61-4b74-95d6-8f9f4d3c6420",
            "aud": [
              "rahbord_client",
              "account"
            ],
            "acr": "1",
            "realm_access": {
              "roles": [
                "offline_access",
                "test-create-role-13",
                "default-roles-irisa",
                "avand_workspace_role",
                "uma_authorization"
              ]
            },
            "azp": "global-Client",
            "auth_time": 1731298795,
            "scope": "openid profile email user",
            "name": "Sedighe Ghanbari",
            "exp": "2024-11-11T04:49:56Z",
            "session_state": "115a9ee2-ef61-4b74-95d6-8f9f4d3c6420",
            "iat": "2024-11-11T04:19:56Z",
            "family_name": "Ghanbari",
            "jti": "c52712e2-0048-4b8c-b828-5d240af09c83",
            "username": "co.ghanbari"
          },
          "name": "f0a3d1f2-9a9f-44bd-8e28-8e407c76f73e",
          "authorities": [
            "SCOPE_openid",
            "SCOPE_email",
            "ROLE_manage-account",
            "ROLE_view-profile",
            "ROLE_manage-account-links",
            "SCOPE_profile",
            "SCOPE_user"
          ]
        }
      `);

     // console.log(201,data);
      
    const baseUrl = 'https://em-stage.irisaco.com'; // مقدار BaseUrl
    const authUrl = `${baseUrl}/oauth/realms/irisa/protocol/openid-connect/auth`;
    const tokenUrl = `${baseUrl}/oauth/realms/irisa/protocol/openid-connect/token`;
    const clientId = 'global-Client';
    const clientSecret = 'O6c54xGq9y0roklEBegIymeauYjZfLtt';
    const redirectUri = 'http://127.0.0.1:5173/auth/signin'; // آدرس بازگشت به سیستم شما


    const redirectToAuth = () => {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'openid profile', // می‌توانید محدوده‌های مورد نیاز را اضافه کنید
        });
        window.location.href = `${authUrl}?${params}`;
    };

    const getAccessToken = async (code: string) => {
        const data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('client_id', clientId);
        data.append('client_secret', clientSecret);
        data.append('redirect_uri', redirectUri);
        data.append('code', code);

        // const response = await axios.post(tokenUrl, data.toString(), {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        // });

        const access_token ='eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkcmNrRFBVU09GQ01oQVFmTzN4M050LVNKeFJyaldEYjNzaVU4QnpRbDBBIn0.eyJleHAiOjE3MzE0ODE0NzUsImlhdCI6MTczMTQ3OTY3NSwiYXV0aF90aW1lIjoxNzMxNDc2ODA2LCJqdGkiOiIzMTlhYTE1My1hNDIxLTQzMzEtODFlOC1hMWE0Y2EyYWM5MGQiLCJpc3MiOiJodHRwczovL2VtLXN0YWdlLmlyaXNhY28uY29tL29hdXRoL3JlYWxtcy9pcmlzYSIsImF1ZCI6WyJyYWhib3JkX2NsaWVudCIsImFjY291bnQiXSwic3ViIjoiZjBhM2QxZjItOWE5Zi00NGJkLThlMjgtOGU0MDdjNzZmNzNlIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZ2xvYmFsLUNsaWVudCIsInNlc3Npb25fc3RhdGUiOiI0ZGYyN2Q2Ni0xNmE3LTRiZDItYWEzMS0xYWNiZmYxYTA3MTYiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidGVzdC1jcmVhdGUtcm9sZS0xMyIsImRlZmF1bHQtcm9sZXMtaXJpc2EiLCJhdmFuZF93b3Jrc3BhY2Vfcm9sZSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmFoYm9yZF9jbGllbnQiOnsicm9sZXMiOlsicmFoYm9yZF93b3Jrc3BhY2VfY2xpZW50X3JvbGUiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXNlciIsInNpZCI6IjRkZjI3ZDY2LTE2YTctNGJkMi1hYTMxLTFhY2JmZjFhMDcxNiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IlNlZGlnaGUgR2hhbmJhcmkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjby5naGFuYmFyaSIsImdpdmVuX25hbWUiOiJTZWRpZ2hlIiwiZmFtaWx5X25hbWUiOiJHaGFuYmFyaSIsInVzZXJuYW1lIjoiY28uZ2hhbmJhcmkifQ.PLFwnvtEmfttytq8NmKZITAQXP8aH5yAL02jCCG2qas0v3ZrHa1GtUwO9qLIjv-KTFPek0BIMHDo1JI-unwORW351fr-ZQEzns56dz7KatXJtnr8iB3pBCOqCRbIBJFXBDyMKIgTC8PrT37a6eFUHyvABvKxVx0Is63y6Ea5z-Jyl12xt7Yk8HvBmbnCP6PAUkrGx3oMgTc91DGYHdlLwblpTHCzc-pDvM7yWGUgud7XLZhzEv78zfYYhZp12bl87J-K4Ae5Vw55kokS4SIZLcx3kCIWRn3vfrY1ZMsyIcXFGG_taJzt3SUkssi4z2Aid-FionLvQbWJ034u4YYvvA'
        return access_token //response.data.access_token;
    };

    const checkForLogin = (e: any) => {

        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);

        const code = urlParams.get('code');
        if (code) {
            getAccessToken(code)
                .then(async (accessToken) => {
                    console.log('good 1');

                    // return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v2/users/SSO_Irisa_Auth`, { accessToken });
                    ////////////
                    getApiClient()
                        .loginWithIrisaSSO({ accessToken })
                        .then(({ data }) => {
                            console.log('sso-5',data);
                            
                            storeTokens(data); // ذخیره توکن‌ها یا داده‌های کاربر
                            NotificationController.showSuccess('ورود موفقیت‌آمیز!');
                            window.location.href = '/'; // هدایت به صفحه اصلی
                        })
                        .catch(err => {
                            console.error('خطا در ورود:', err);
                            NotificationController.showError('ورود ناموفق!');
                        });
                    ///////////////
                })
        } else {
            redirectToAuth();
        }
    }

    useEffect(() => {
        checkForLogin
    }, [])

    return (
        <div>
            <br />
            <button className='my-btn' onClick={(e) => checkForLogin(e)}>ورود با ایریسا</button>
        </div>
    );
};

export default LoginWithIrisa;
