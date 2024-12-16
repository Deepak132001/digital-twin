// src/pages/InstagramCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Instagram, CheckCircle, XCircle } from 'lucide-react';

const InstagramCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      
      if (!code) {
        setStatus('error');
        setTimeout(() => navigate('/instagram'), 2000);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/instagram/callback?code=${code}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setStatus('success');
          setTimeout(() => navigate('/instagram'), 2000);
        } else {
          setStatus('error');
          setTimeout(() => navigate('/instagram'), 2000);
        }
      } catch (error) {
        setStatus('error');
        setTimeout(() => navigate('/instagram'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const statusConfig = {
    processing: {
      icon: Instagram,
      title: 'Connecting to Instagram...',
      message: 'Please wait while we complete the connection.',
      color: 'text-blue-500'
    },
    success: {
      icon: CheckCircle,
      title: 'Successfully Connected!',
      message: 'Your Instagram account has been connected.',
      color: 'text-green-500'
    },
    error: {
      icon: XCircle,
      title: 'Connection Failed',
      message: 'Failed to connect your Instagram account.',
      color: 'text-red-500'
    }
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <StatusIcon className={`w-16 h-16 mx-auto mb-4 ${currentStatus.color}`} />
        <h2 className={`text-2xl font-bold mb-2 ${currentStatus.color}`}>
          {currentStatus.title}
        </h2>
        <p className="text-gray-600">
          {currentStatus.message}
        </p>
      </div>
    </div>
  );
};

export default InstagramCallback;