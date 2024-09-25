import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

import axios from 'axios';
import { NotificationController } from '../../lib/notificationController';
import { storeTokens } from '../../pages/Authentication/utils';

const LoginWithGmail: React.FC = () => {

    const handleLoginSuccess = async (response: CredentialResponse) => {
        console.log('Login successful:', response);
        console.log(785);

        const token = response.credential;
        console.log(8989);

        try {
            console.log(8);
            
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v2/users/googleAuth`, { token });
            if (res.data.needsProfileCompletion) {
                console.log(78);
                window.location.href = '/auth/signup';
            } else {
                console.log(79);
                storeTokens(res.data.data);
                NotificationController.showSuccess(res.data.data.message);
                window.location.href = '/';
            }
        } catch (error) {
            console.log(10);
            
            console.error('Login failed:', error);
        }
    };

    const handleLoginFailure = () => {
        console.error('898957687 Login failed:');
    };


    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
            />
        </GoogleOAuthProvider>
    );
};

export default LoginWithGmail;
