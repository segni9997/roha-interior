import logo from "../assets/rohalandscape.png";

import { ArrowRight, Play, Users, Building } from "lucide-react";

export default function ModelHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
      {/* Background geometric shapes with clip-path */}
      <div className="absolute inset-0">
        {/* Large background shape */}
        <div
          className="absolute top-0 right-0 w-2/3 h-full opacity-10"
          style={{
            background: "linear-gradient(135deg, #395e63 0%, #5b949b 100%)",
            clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        ></div>

        {/* Secondary geometric element */}
        <div
          className="absolute top-20 right-20 w-96 h-96 opacity-20"
          style={{
            background: "linear-gradient(45deg, #5b949b 0%, #7db3b8 100%)",
            clipPath:
              "polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)",
          }}
        ></div>

        {/* Small accent shapes */}
        <div
          className="absolute top-40 left-20 w-32 h-32 opacity-30"
          style={{
            backgroundColor: "#395e63",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#395e63] to-[#5b949b]">
              <Award className="w-4 h-4 mr-2" />
              Award-Winning Model Makers
            </div> */}

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                <span className="block">Precision</span>
                <span className="block bg-gradient-to-r from-[#395e63] to-[#5b949b] bg-clip-text text-transparent">
                  Model Making
                </span>
                <span className="block text-4xl lg:text-5xl text-gray-700">
                  by Roha
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Transforming architectural visions into stunning physical models.
              We craft detailed, accurate representations that bring your
              designs to life with unmatched precision and artistry.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#395e63]">500+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#395e63]">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#395e63]">98%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-[#395e63] to-[#5b949b] text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 16px) 0, 100% 100%, 16px 100%)",
                }}
              >
                <span className="relative z-10 flex items-center">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2d4a4f] to-[#4a7a7f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              <button className="group flex items-center px-8 py-4 text-[#395e63] font-semibold border-2 border-[#395e63] hover:bg-[#395e63] hover:text-white transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Watch Our Process
              </button>
            </div>
          </div>

          {/* Right content - Visual elements */}
          <div className="relative">
            {/* Main visual container */}
            <div className="relative">
              {/* Primary image placeholder with clip-path */}
              <div
                className="w-full h-96 bg-transparent relative overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)",
                }}
              >
                <img
                  src={logo}
                  alt="Roha Model Making Workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#395e63]/20 to-transparent"></div>
              </div>

              {/* Floating cards */}
              <div
                className="absolute -top-6 -right-6 w-32 h-32 bg-white shadow-xl flex flex-col items-center justify-center"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                }}
              >
                <Building className="w-8 h-8 text-[#395e63] mb-2" />
                <span className="text-xs font-semibold text-gray-700">
                  3D Models
                </span>
              </div>

              <div
                className="absolute -bottom-6 -left-6 w-40 h-24 bg-gradient-to-r from-[#395e63] to-[#5b949b] text-white flex items-center justify-center"
                style={{
                  clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
                }}
              >
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-semibold">Expert Team</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div
              className="absolute top-20 -left-8 w-16 h-16 opacity-60"
              style={{
                backgroundColor: "#7db3b8",
                clipPath:
                  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
              }}
            ></div>

            <div
              className="absolute bottom-20 -right-4 w-12 h-12 opacity-40"
              style={{
                backgroundColor: "#395e63",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 opacity-20"
        style={{
          background:
            "linear-gradient(90deg, #395e63 0%, #5b949b 50%, #7db3b8 100%)",
          clipPath: "polygon(0 50%, 100% 80%, 100% 100%, 0% 100%)",
        }}
      ></div>
    </section>
  );
}
