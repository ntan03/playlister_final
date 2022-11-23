import { useContext } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

function ViewToolbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    
}