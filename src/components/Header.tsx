import GithubLogo from '../assets/github-mark.png';

function Header() {
  return (
    <header className="flex justify-between gap-2 px-6 py-2 shadow-sm">
      <div className="flex text-2xl font-thin uppercase text-brand">Choropleth Editor</div>
      <a href="https://github.com/jessihamel/sweet-charts">
        <img className="h-[30px]" src={GithubLogo} alt="Github Logo" />
      </a>
    </header>
  );
}

export default Header;
