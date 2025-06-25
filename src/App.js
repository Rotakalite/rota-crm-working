import React, { useState } from 'react';

import LoginForm from './components/LoginForm';

import AdminDashboard from './components/AdminDashboard';

import Dashboard from './components/Dashboard';

function App() {

const [user, setUser] = useState(null);

return (

<div>

{!user ? (

<LoginForm onLogin={setUser} />

) : user.isAdmin ? (

<AdminDashboard user={user} onLogout={() => setUser(null)} />

) : (

<Dashboard user={user} onLogout={() => setUser(null)} />

)}

</div>

);

}

export default App;
