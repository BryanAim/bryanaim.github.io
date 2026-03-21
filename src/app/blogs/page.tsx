export default function Blogs() {
  return (
    <main id="blogs">
      <h1 className="lg-heading">
        Blogs & <span className="text-secondary">Learning</span>
      </h1>
      <h2 className="sm-heading">
        Documenting my journey with Claude Code and development
      </h2>
      <div className="blog-content">
        <div className="video">
          <h3>YouTube Video: Claude Code Abilities</h3>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Claude Code Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="learning-docs">
          <h3>Live Build Learning Docs</h3>
          <p>Today I built: Next.js migration, Tailwind setup, M-Pesa integration...</p>
          {/* Add more content */}
        </div>
      </div>
    </main>
  )
}