import Footer from "./components/common/Footer";
import Header from "./components/common/Header";

export default function ClientLayout({ children }) {
    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
