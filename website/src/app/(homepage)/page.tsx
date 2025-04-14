import Link from "next/link"
import { CheckCircle } from "lucide-react"
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 stroke-gray-400" />
          <span className="text-xl font-semibold text-gray-400">Ion Recording</span>
        </div>
        <Link
          href="/library"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{backgroundColor: '#7c24d9', background: 'linear-gradient(90deg, #7c24d9, #4a03b8)'}}
        >
          Get started
        </Link>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 text-center max-w-5xl">
          <div className="flex justify-center items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl text-white font-bold mb-4">Record, Edit & Share Videos with Ease</h1>
              <p className="text-lg text-gray-300 mb-8">
                Capture your screen and webcam using our Chrome extension and manage your videos with ease.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://chromewebstore.google.com/detail/deepseek-ia/npphdmcakmfhllhblkealgkeefamebih"
                  style={{backgroundColor: '#7c24d9', background: 'linear-gradient(90deg, #7c24d9, #4a03b8)'}}
                  className="h-fit bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Install Extension
                </Link>
                <Link
                  href="/library"
                  className="bg-transparent hover:bg-purple-900/30 text-white border border-purple-500 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Access portal
                </Link>
              </div>
            </div>
            <div>
              <Image src="/images/laptop-neon-purple.png"
                alt="Login visual"
                width={500}
                height={500}
                priority />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="square"
              title="Screen Recording"
              description="Effortlessly record your screen or webcam"
            />
            <FeatureCard
              icon="star"
              title="Powerful Editor"
              description="Create stunning videos with our intuitive editor"
            />
            <FeatureCard
              icon="download"
              title="Cloud Library"
              description="Securely store and manage your video files"
            />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">Why Choose Ion?</h2>
          <p className="text-center text-gray-300 mb-12">Enjoy crystal-clear video quality for all your recordings</p>
          <div className="grid md:grid-cols-3 gap-6">
            <BenefitCard
              icon="hd"
              title="High Definition"
              description="Enjoy crystal-clear video quality for all recordings"
            />
            <BenefitCard icon="x" title="No Watermark" description="Export your videos without any watermarks" />
            <BenefitCard icon="lock" title="Secure & Private" description="Your recordings are encrypted and private" />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-200">Get Started Today</h2>
          <p className="text-gray-300 mb-8">Sign up and start creating amazing videos minutes.</p>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-purple-800/50 rounded-lg flex items-center justify-center mx-auto mb-4">
        {icon === "square" && <div className="w-6 h-6 border-2 border-white rounded-sm"></div>}
        {icon === "star" && <div className="text-purple-400 text-2xl">★</div>}
        {icon === "download" && (
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white stroke-white"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6 bg-purple-900/20 border border-purple-900/50">
      <div className="w-12 h-12 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon === "hd" && <div className="font-bold text-sm text-white">HD</div>}
        {icon === "x" && <div className="text-purple-400 text-xl">✕</div>}
        {icon === "lock" && (
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white stroke-white"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}
