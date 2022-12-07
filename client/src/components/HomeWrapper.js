import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    console.log("Guest: ", auth.guest);
    
    if (auth.loggedIn || auth.guest)
        return <HomeScreen />
    else
        return <SplashScreen />
}