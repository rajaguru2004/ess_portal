'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';
import { setAuthToken, setUser } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.login(username, password);

            if (response.success) {
                // Store token and user info
                setAuthToken(response.data.accessToken);
                setUser(response.data.user);

                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDE2em0wLTRWMzJIMjR2LTJoMTZ6bTAtNHYySDI0di0yaDE2em0wLTR2MkgyNHYtMmgxNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        ESS Portal
                    </h1>
                    <p className="text-purple-200">Admin Dashboard</p>
                </div>

                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
                        <CardDescription className="text-purple-200">
                            Enter your credentials to access the admin panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-white">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/50"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-purple-200">
                            <p>Default credentials:</p>
                            <code className="text-xs bg-white/10 px-2 py-1 rounded mt-1 inline-block">
                                admin / AdminPassword123!
                            </code>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-purple-200/60 text-xs mt-6">
                    © 2026 ESS Portal. All rights reserved.
                </p>
            </div>
        </div>
    );
}
