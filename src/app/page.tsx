import Link from 'next/link';

// Projects to display
const PROJECTS = [
  {
    title: "Home",
    description: "List of all my apps",
    link: "/",
    status: "Online",
    tags: ["Node.js", "React", "Next.js", "Tailwind"]
  },
  {
    title: "Video Games Tier List",
    description: "Make a tier list of the video games you've played this year!",
    link: "#",
    status: "In developement",
    tags: ["Node.js", "React", "Next.js", "Tailwind"]
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <main className="max-w-5xl mx-auto px-6 py-20">
        
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Project Hub
          </h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl">
            Welcome to my app hub.
          </p>
        </header>

        {/* Grille de projets */}
        <div className="grid gap-6 md:grid-cols-2 cursor-pointer" >
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
                  project.status === "Online" ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                }`}>
                  {project.status}
                </span>
              </div>

              <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                {project.title}
              </h2>
              <p className="text-slate-400 mt-3 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <Link 
                href={project.link}
                className="inline-flex items-center text-sm font-semibold text-white group-hover:translate-x-1 transition-transform"
              >
                Access the app <span className="ml-2">→</span>
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}