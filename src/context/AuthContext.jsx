const { createContext, useState, useEffect, useContext } = require("react");

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // 1. Simulate checking for a session in LocalStorage
        const savedUser = localStorage.getItem("user");
        const savedProfile = localStorage.getItem("profile");
        const token = localStorage.getItem("access_token");

        if (token && savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
                if (savedProfile) setProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error("Failed to parse storage data", e);
                // If data is corrupted, clear it
                localStorage.clear();
            }
        }

        setLoading(false);
    }, [])

    const login = (userData, token) => {
        // Simulate a successful login
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", token);

        setUser(userData);
        setProfile(userData);
    };

    const logout = () => {
        // Clear everything
        localStorage.removeItem("user");
        localStorage.removeItem("profile");
        localStorage.removeItem("access_token");

        // Reset state
        setUser(null);
        setProfile(null);
    };

    const refreshProfile = () => {
        // Just pull from storage again or stay as is
        const savedProfile = localStorage.getItem("profile");
        if (savedProfile) setProfile(JSON.parse(savedProfile));
    };

    const updateProfile = (newData) => {
        const updated = { ...profile, ...newData };
        setProfile(updated);
        localStorage.setItem("profile", JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout, refreshProfile, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);