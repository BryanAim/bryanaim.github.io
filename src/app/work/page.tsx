export default function Work() {
  return (
    <main id="work">
      <h1 className="lg-heading">
        My <span className="text-secondary">Work</span>
      </h1>
      <h2 className="sm-heading">
        Check out some of my projects...
      </h2>
      <section>
        <div className="projects">
          <div className="item">
            <a href="https://weathernow-afb00.web.app/">
              <img src="/img/projects/weather.jpg" alt="project" />
            </a>
            <a href="https://weathernow-afb00.web.app/" className="btn-light">
              <i className="fas fa-eye"></i> WeatherNow
            </a>
            <a href="https://github.com/BryanAim/weather-app" className="btn-dark">
              <i className="fab fa-github"></i> Github
            </a>
          </div>
          <div className="item">
            <a href="https://isalebryan.me/everything-corona-virus/">
              <img src="/img/projects/corona.jpg" alt="project" />
            </a>
            <a href="https://isalebryan.me/everything-corona-virus/" className="btn-light">
              <i className="fas fa-eye"></i> Everything Coronavirus
            </a>
            <a href="https://github.com/BryanAim/everything-corona-virus" className="btn-dark">
              <i className="fab fa-github"></i> Github
            </a>
          </div>
          <div className="item">
            <a href="https://aim-vuegram.herokuapp.com/">
              <img src="/img/projects/vuegram.jpg" alt="project" />
            </a>
            <a href="https://aim-vuegram.herokuapp.com/" className="btn-light">
              <i className="fas fa-eye"></i> VueGram
            </a>
            <a href="https://github.com/BryanAim/vuegram" className="btn-dark">
              <i className="fab fa-github"></i> Github
            </a>
          </div>
          <div className="item">
            <a href="http://naxtechmakers.com/">
              <img src="/img/projects/naxtechmakers.jpg" alt="project" />
            </a>
            <a href="http://naxtechmakers.com/" className="btn-light">
              <i className="fas fa-eye"></i> NaxTechmakers
            </a>
            <a href="https://github.com/NakuruTechMakers/techiesofnakuru" className="btn-dark">
              <i className="fab fa-github"></i> Github
            </a>
          </div>
        </div>
      </section>
      <br />
      <h2 className="sm-heading text-secondary">
        Design Projects...
      </h2>
      <section>
        <div className="projects">
          <div className="item">
            <img src="/img/bmx/design1.jpg" alt="Design project" />
          </div>
        </div>
      </section>
    </main>
  )
}