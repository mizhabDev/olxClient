import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/user/userDetails", {
                    credentials: "include", // This sends cookies with the request
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login"
            replace
            state={{
                warning: "Please log in to continue",
            }}
        />;
    }

    return <Outlet />;
};

export default AuthGuard;
