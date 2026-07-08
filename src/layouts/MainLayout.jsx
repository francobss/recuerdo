import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";

export default function MainLayout({ onLogout, children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundBlobs />
      <Navbar onLogout={onLogout} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
