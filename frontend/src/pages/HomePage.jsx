import { Check, Code2, Users, Video, Zap ,ArrowRightIcon} from "lucide-react";
import {SignInButton} from "@clerk/clerk-react";
import { useSearchParams } from "react-router";
import { getSafeRedirect } from "../util/utils.js";
import HomeTerminal from "../components/HomeTerminal";

function HomePage() {
  // invite links send signed-out users here with ?redirect=/session/:id
  const [searchParams] = useSearchParams();
  const afterSignInUrl = getSafeRedirect(searchParams.get("redirect")) || undefined;

  return (
    <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 min-h-screen text-white overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative bg-slate-950/40 backdrop-blur-xl border-b border-emerald-500/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-200 group cursor-pointer">
            <div className="size-10 rounded-xl overflow-hidden shadow-lg">
              <img
                src="/Logo.png"
                alt="CodeSync Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent font-mono tracking-wider">
                CodeSync
              </span>
              <span className="text-xs text-emerald-400/70 font-medium -mt-1">Code Together</span>
            </div>
          </div>

          {/* AUTH BTN - low-key, "Start Coding Now" in the hero is the main action */}
            <SignInButton mode="modal" forceRedirectUrl={afterSignInUrl} signUpForceRedirectUrl={afterSignInUrl}>
                <button className="px-5 py-2.5 border border-emerald-500/40 rounded-xl text-emerald-300 font-semibold text-sm hover:bg-emerald-500/10 hover:border-emerald-400/60 transition-all duration-200">
                Sign in
                </button>
            </SignInButton>
            </div>
        </nav>

      {/* HERO SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 pt-5 pb-5 z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
              <Zap className="size-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">Real-time Collaboration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-white">Innovate Together</span>
            </h1>

            <p className="text-lg text-emerald-100/70 leading-relaxed max-w-xl">
              The ultimate platform for collaborative coding interviews and pair programming. Connect face-to-face, code in real-time, and ace your technical interviews with our powerful terminal-inspired interface.
            </p>

            {/* CTA - main action right after the pitch */}
            <div className="flex flex-wrap gap-4">
                <SignInButton mode="modal" forceRedirectUrl={afterSignInUrl} signUpForceRedirectUrl={afterSignInUrl}>
                    <button className="group px-10 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
                    Start Coding Now
                    <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </SignInButton>
            </div>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              {["Live Video Chat", "Code Editor", "Multi-Language"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg backdrop-blur-sm hover:border-emerald-400/50 transition-colors">
                  <Check className="size-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-200">{feature}</span>
                </div>
              ))}
            </div>


            {/* STATS */}
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-8">
              {[
                { value: "Maahi Ratanpara", label: "Creator of CodeSync" },
                { value: "“Clarity beats cleverness.”", label: "Interview Philosophy" },
                { value: "“Real interviews need real tools.”", label: "Why This Exists" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 bg-slate-800/30 border border-emerald-500/20 rounded-lg backdrop-blur-sm"
                >
                  {/* Value */}
                  <div className="text-base font-semibold text-emerald-400 leading-snug">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="mt-1 text-xs text-emerald-300/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT MAC TERMINAL */}
          <HomeTerminal />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            Everything You Need to <span className="text-emerald-400">Succeed</span>
          </h2>
          <p className="text-lg text-emerald-200/60 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Video, title: "HD Video Call", desc: "Crystal clear video and audio for seamless communication during interviews" },
            { icon: Code2, title: "Live Code Editor", desc: "Collaborate in real-time with syntax highlighting and multiple language support" },
            { icon: Users, title: "Easy Collaboration", desc: "Share your screen, discuss solutions, and learn from each other in real-time" },
          ].map((feature, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative p-8 bg-slate-800/40 border border-emerald-500/20 rounded-xl backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                <div className="size-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                  <feature.icon className="size-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-emerald-200/60">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;