import React, { useEffect } from 'react';
import axios from 'axios';
import { NotificationController } from '../../../lib/notificationController';
import { storeTokens } from '../../../pages/Authentication/utils';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';

const LoginWithIrisa: React.FC = () => {
    const baseUrl = 'https://em-stage.irisaco.com'; // مقدار BaseUrl
    const authUrl = `${baseUrl}/oauth/realms/irisa/protocol/openid-connect/auth`;
    const tokenUrl = `${baseUrl}/oauth/realms/irisa/protocol/openid-connect/token`;
    const apiUrl = `${baseUrl}/avand/api/me`; // آدرس API اصلی شما

    const clientId = 'global-Client';
    const clientSecret = 'O6c54xGq9y0roklEBegIymeauYjZfLtt';
    const redirectUri = 'https://your-redirect-uri.com'; // آدرس بازگشت به سیستم شما

    const redirectToAuth = () => {

        console.log(53);
        
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'openid profile', // می‌توانید محدوده‌های مورد نیاز را اضافه کنید
        });
        console.log(53,`${authUrl}?${params}`);
        window.location.href = `${authUrl}?${params}`;
    };

    const getAccessToken = async (code: string) => {
        const data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('client_id', clientId);
        data.append('client_secret', clientSecret);
        data.append('redirect_uri', redirectUri);
        data.append('code', code);

        const response = await axios.post(tokenUrl, data.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data.access_token;
    };

    const getUserData = async (accessToken: string) => {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;
    };

    const checkForLogin = (e: any) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            getAccessToken(code)
                .then(accessToken => {
                    return getUserData(accessToken);
                })
                .then(data => {
                    storeTokens(data); // ذخیره توکن‌ها یا داده‌های کاربر
                    NotificationController.showSuccess('ورود موفقیت‌آمیز!');
                    window.location.href = '/'; // هدایت به صفحه اصلی
                })
                .catch(err => {
                    console.error('خطا در ورود:', err);
                    NotificationController.showError('ورود ناموفق!');
                });
        } else {
            redirectToAuth();
        }
    }

    return (
        <div>
            <br />
            <button className='my-btn' onClick={(e) => checkForLogin(e)}>ورود با ایریسا</button>
        </div>
    );
};

export default LoginWithIrisa;
