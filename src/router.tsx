import { createHashRouter } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import App from './App'
import ProfilePage from './pages/ProfilePage'

export const router = createHashRouter([
	{
		element: <RootLayout />,
		children: [
			{ path: '/', element: <App /> },
			{ path: '/profile/:id', element: <ProfilePage /> },
		],
	},
])
