import { useNavigate } from 'react-router-dom';
import React from 'react';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Expense Tracker</h1>
            <p>Manage you expenses smartly!!</p>

            <button onClick = {() => navigate("/auth")}>
                Login
            </button>
        </div>
    );
}

export default Home;