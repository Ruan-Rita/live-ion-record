import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Video, Library, Wand2, Download } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Iion</span>
          </div>
          <Button asChild className="bg-emerald-700">
            <Link href="#get-started">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Record, Edit, and Share Videos with Ease
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Use our Chrome extension to record videos, edit them with AI, and
            access your library anywhere.
          </p>
          <Button size="lg" asChild>
            <Link href="#get-started">
              Install Extension
              <Chrome className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button className="ml-4 bg-emerald-700" size="lg" asChild>
            <Link href="/auth/login">
              Acessar painel
              <Chrome className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <section className="bg-muted py-12 bg-emerald-300">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Chrome className="mr-2 h-5 w-5" />
                    Easy Recording
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Record videos directly from your browser using our Chrome
                  extension.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Library className="mr-2 h-5 w-5" />
                    Video Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Access and organize your videos on our website or mobile app.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wand2 className="mr-2 h-5 w-5" />
                    AI Editing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Edit your videos effortlessly using our AI-powered tools.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="mb-6 text-3xl font-bold">Download for Any Device</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Edit and download your videos for use on any device or platform.
          </p>
          <Button size="lg" variant="outline">
            <Download className="mr-2 h-5 w-5" />
            Download App
          </Button>
        </section>
      </main>

      <footer className="bg-muted py-6 bg-emerald-700">
        <div className="container mx-auto px-4 text-center text-slate-100 text-sm text-muted-foreground">
          © 2023 VideoMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
