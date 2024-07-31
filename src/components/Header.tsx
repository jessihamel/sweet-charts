import { useContext } from 'react';
import { AppContext } from '../AppContext';

function Header() {
  const { headerRef } = useContext(AppContext);

  return (
    <header className="px-6 py-2 flex flex-col gap-2 shadow-sm" ref={headerRef}>
      <div className="text-2xl uppercase flex font-thin ">Choropleth Editor</div>
    </header>
  );
}

export default Header;
