'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestUserPasswordReset } from '@/app/actions/user/password';
import { requestVendorPasswordReset } from '@/app/actions/vendor/password';

export default function ForgotPasswordForm({ type = 'user' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const action = type === 'vendor' ? requestVendorPasswordReset : requestUserPasswordReset;

      const response = await action(email);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to send reset email.'
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message || 'Failed to request reset.'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="mt-1"
        />
      </div>

      {message && (
        <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}
