export const Header = () => {
	return (
		<header className="header">
			<nav className="header__nav">
				<ul className="header__nav-list">
					<li className="header__nav-item">
						<a href="#home" className="header__nav-link">
							Home
						</a>
					</li>
					<li className="header__nav-item">
						<a href="#about" className="header__nav-link">
							About
						</a>
					</li>
					<li className="header__nav-item">
						<a href="#contact" className="header__nav-link">
							Contact
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
};
