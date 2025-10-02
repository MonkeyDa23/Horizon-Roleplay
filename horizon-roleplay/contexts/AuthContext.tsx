import React, { createContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import { Loader } from 'lucide-react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Discord OAuth2 Configuration ---
const DISCORD_CLIENT_ID = '1423341328355295394';
// Use the static redirect URI for the specific development environment to match Discord's settings.
const REDIRECT_URI = "https://0hy15mnret9jdh6artn451gae3q73nd8w7op3n9ii86aj15fmw-h813239537.scf.usercontent.goog/79e56d6f-3998-451f-90e0-2c56f108bfc8";
// Add 'guilds.members.read' to request role information
const OAUTH_SCOPES = 'identify guilds.members.read';
const DISCORD_GUILD_ID = '123456789012345678'; // <-- IMPORTANT: Replace with your actual Guild ID
const MOCK_ADMIN_ID = "1328693484798083183"; 

// --- MOCK PERMISSION DATA ---
// In the Discord API, permissions are a bitfield. 0x8 is the ADMINISTRATOR flag.
const PERMISSIONS = {
  ADMINISTRATOR: (1 << 3), // 8 or 0x8
  STANDARD_USER: 0,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthCallback, setIsAuthCallback] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // For Authorization Code Flow, params are in the search string
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      if (window.opener && code && state) {
        setIsAuthCallback(true);
        const storedState = sessionStorage.getItem('oauth_state');

        if (state === storedState) {
          sessionStorage.removeItem('oauth_state');

          // --- MOCK API CALLS ---
          // This entire block simulates what a secure backend server should do.
          // A real backend would exchange the 'code' for an access token here.
          try {
            // 1. Mock fetch user's basic identity (/users/@me)
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockBasicUser = {
              id: MOCK_ADMIN_ID,
              username: 'AdminUser',
              avatar: '1a2b3c4d5e6f7g8h9i0j', // Just an example hash
            };

            // 2. Mock fetch user's roles in your specific guild (/users/@me/guilds/{guild.id}/member)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let userIsAdmin = false;
            // For our mock user, we give them an admin role. For anyone else, they get no roles.
            if (mockBasicUser.id === MOCK_ADMIN_ID) {
                // This simulates the response from the guild member endpoint
                const mockGuildMember = {
                    roles: ['role_admin_123'], // ID of the role the user has
                };
                
                // 3. Mock fetching the details of all roles in the guild
                const mockGuildRoles = [
                    { id: 'role_admin_123', name: 'Server Admin', permissions: PERMISSIONS.ADMINISTRATOR.toString() },
                    { id: 'role_member_456', name: 'Member', permissions: PERMISSIONS.STANDARD_USER.toString() },
                ];

                // 4. Check if any of the user's roles have the Administrator permission
                for (const userRoleId of mockGuildMember.roles) {
                    const roleDetails = mockGuildRoles.find(r => r.id === userRoleId);
                    if (roleDetails) {
                        const permissions = parseInt(roleDetails.permissions, 10);
                        // Use bitwise AND to check for the ADMINISTRATOR flag
                        if ((permissions & PERMISSIONS.ADMINISTRATOR) === PERMISSIONS.ADMINISTRATOR) {
                            userIsAdmin = true;
                            break; 
                        }
                    }
                }
            }

            // 5. Construct final user object
            const finalUser: User = {
                id: mockBasicUser.id,
                username: mockBasicUser.username,
                // The avatar URL is constructed with the user ID and avatar hash
                avatar: `https://cdn.discordapp.com/avatars/${mockBasicUser.id}/${mockBasicUser.avatar}.png`,
                isAdmin: userIsAdmin,
            };

            window.opener.postMessage({ type: 'auth-success', user: finalUser }, window.location.origin);

          } catch (e) {
            window.opener.postMessage({ type: 'auth-error', error: 'Failed to fetch user data.' }, window.location.origin);
          }
        
        } else if (params.has('error')) {
          const error = params.get('error_description') || 'An unknown error occurred.';
          window.opener.postMessage({ type: 'auth-error', error }, window.location.origin);
        }

        window.close();
      }
    };
    
    // Check if the current window is an OAuth callback popup
    if (window.location.search.includes('code=')) {
      handleAuthCallback();
    }
  }, []);

  const login = () => {
    setLoading(true);
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code', // Switched to Authorization Code flow
      scope: OAUTH_SCOPES,
      state: state,
      prompt: 'consent' 
    });
    
    const discordAuthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;
    const width = 500;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      discordAuthUrl,
      'DiscordAuth',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (popup) {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          setLoading(false);
        }
      }, 500);
    } else {
      alert("Popup was blocked. Please allow popups for this site to log in.");
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { type, user, error } = event.data;

      if (type === 'auth-success' && user) {
        setUser(user);
        setLoading(false);
        // Clean up the URL in the main window if it has auth params from a failed redirect
        if (window.location.search.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (type === 'auth-error') {
        console.error("Discord OAuth Error:", error);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  if (isAuthCallback) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-brand-dark">
        <Loader size={48} className="text-brand-cyan animate-spin" />
        <p className="mt-4 text-white text-lg">Processing login...</p>
        <p className="text-gray-400">Please wait, this window will close automatically.</p>
      </div>
    );
  }

  const value = { user, login, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};