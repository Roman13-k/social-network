import "../globals.css";
import Footer from "@/components/ui/layout/footer/Footer";
import Header from "@/components/ui/layout/header/Header";
import MainContainer from "@/components/ui/shared/containers/MainContainer";

export default function LayoutWithFooter({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col relative w-full'>
      <div className='flex w-full'>
        <Header />
        <main className='w-full'>
          <MainContainer className='min-h-[100dvh]'>{children}</MainContainer>
        </main>
      </div>
      <Footer />
    </div>
  );
}
