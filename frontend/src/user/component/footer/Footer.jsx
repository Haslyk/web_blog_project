import footerBg from '../../../Images/site_assets/footer-bg.webp'
import logo from '../../../Images/site_assets/uni_logo.png'
import gmail from '../../../Images/site_assets/gmail.svg'
import x from '../../../Images/site_assets/X-white.svg';
import './footer.css'


const Footer = () => {
    return (
        <footer className="footer" id="footer" style={{ "backgroundImage": `url(${footerBg})` }}>
            <div className="footer-top">
                <div className="container">
                    <div className="footer-brand" >
                        <div >
                            <img src={logo}
                                width={120}
                                height={120}
                                alt="community logo"
                            />
                            <p className="footer-brand-text" >
                                Sitemizi ziyaret ettiğiniz için teşekkür ederiz.
                            </p>
                            <div className="wrapper" >
                                <ul className="social-list" >
                                    
                                    <li>
                                        <a href="https://www.instagram.com/halimaslyk" target="_blank" className="social-link">
                                            <ion-icon name="logo-instagram"></ion-icon>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/halimaslykk" target="_blank" className="social-link">
                                            <img className='X-logo' src={x} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/haslyk" target="_blank" className="social-link">
                                            <ion-icon name="logo-github"></ion-icon>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className='flexlinks'>
                            <p>
                                Bizimle İletişime Geçin.
                            </p>
                            <br />

                            <div className="wrapper" >
                                <img src={gmail} className='wrapper-1' height={30} width={30} alt="gmail" />
                                <a href="mailto:samublog@samsun.edu.tr" target="_blank" className="footer-link">
                                    samublog@samsun.edu.tr
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p className="copyright">
                        Copyright &copy; {new Date().getFullYear()} Tüm Hakları Saklıdır. <span className="copyright-link">HalimAslyk</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
