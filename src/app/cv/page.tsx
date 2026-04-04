export default function CV() {
  return (
    <main id="cv">
      <h1 className="lg-heading">
        My <span className="text-secondary">CV</span>
      </h1>
      <h2 className="sm-heading">
        Download or view my resume
      </h2>
      <div className="cv-content">
        <a href="/isale_brian_cv.pdf" className="btn-dark">Download CV</a>
        {/* Embed or display CV content */}
      </div>
    </main>
  )
}