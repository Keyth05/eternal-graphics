import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import CartDrawer from "../cart/Cart";

export default function Navbar() {
    const auth = useAuth();
    const [cartOpen, setCartOpen] = useState(false);

    const signOutRedirect = () => {
        const clientId = "37m287vb94c99snq1195gn6ctd";
        const logoutUri = "http://localhost:5173/";
        const cognitoDomain = "https://us-east-1160ukm3vq.auth.us-east-1.amazoncognito.com";
        auth.removeUser(); // Clear user context
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    const handleCartOpen = () => {
        setCartOpen(true);
    };

    const handleCartClose = () => {
        setCartOpen(false);
    };

    if (auth.isLoading) {
        return (
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }

    return (
        <>
            <nav className="flex items-center justify-between p-4 bg-gray-200 text-gray-900 fixed top-0 left-0 right-0 z-10">
                <div className="text-xl">
                    <h1 className="text-2xl font-light cursor-pointer">
                        <Link to="/">
                            Eternal <span className="font-semibold">Graphics</span>
                        </Link>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="px-6 py-2 rounded bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                    <button
                        onClick={handleCartOpen}
                        className="px-3 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        <img src="https://img.icons8.com/?size=23&id=CE7rP-35_XQR&format=png&color=000000" alt="Cart" />
                    </button>
                </div>
                <div className="flex space-x-4">
                    {auth.isAuthenticated ? (
                        <div className="flex">
                            <p className="flex items-center gap-4 spx-4 py-2 text-gray-800 rounded font-light">
                                <img src={auth.user?.profile.picture} className="w-8 h-8 rounded-full" alt="" />
                                <span className="font-semibold">{auth.user?.profile.given_name} {auth.user?.profile.family_name}</span>
                            </p>
                            <button
                                onClick={signOutRedirect}
                                className="px-4 py-2 text-gray-300 bg-gray-500 rounded hover:bg-gray-600 ml-3"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => auth.signinRedirect()}
                            className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            {/* Usamos el componente CartDrawer */}
            <CartDrawer open={cartOpen} handleClose={handleCartClose} />
        </>
    );
}
