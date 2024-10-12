import './loadingScreen.css'
import logo from '../../../Images/site_assets/logo.avif'

const LoadingScreen = () => {
    return (
        <>
            <div className='loading_screen'></div>
            <img src={logo} className='loading_image' alt="logo"/>
        </>
    )
}

export default LoadingScreen