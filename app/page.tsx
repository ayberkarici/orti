"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, CheckCircle2, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Orti</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">
                            Giriş Yap
                        </Link>
                        <Link href="/login">
                            <Button>Ücretsiz Başla</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-100/30 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            v1.0 Yayında - Şimdi Deneyin
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                            Ortaklar için <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                                Yeni Nesil Takvim
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Karmaşık proje yönetim araçlarını unutun. Orti, iş ortakları ve indie maker&apos;lar için tasarlanmış,
                            gerçek zamanlı ve minimalist bir takvim sistemidir.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/login">
                                <Button size="lg" className="h-12 px-8 text-base rounded-full w-full sm:w-auto">
                                    Hemen Başla <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full w-full sm:w-auto">
                                    Özellikleri Keşfet
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image / Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-20 relative mx-auto max-w-5xl"
                    >
                        <div className="rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                                {/* Mockup Header */}
                                <div className="bg-slate-50 border-b px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="mx-auto bg-white px-3 py-1 rounded-md text-xs text-slate-400 border shadow-sm">
                                        orti.app/dashboard
                                    </div>
                                </div>
                                {/* Mockup Content - Abstract Calendar Grid */}
                                <div className="p-6 grid grid-cols-7 gap-px bg-slate-100 aspect-[16/9]">
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="bg-white p-2 relative group hover:bg-slate-50 transition-colors">
                                            <div className="text-xs text-slate-400 mb-2">Gün {i + 1}</div>
                                            {i === 1 && (
                                                <div className="bg-blue-100 text-blue-700 text-xs p-2 rounded mb-2 font-medium border-l-4 border-blue-500">
                                                    Yazılım Toplantısı
                                                </div>
                                            )}
                                            {i === 3 && (
                                                <div className="bg-purple-100 text-purple-700 text-xs p-2 rounded mb-2 font-medium border-l-4 border-purple-500">
                                                    Lansman Hazırlığı
                                                </div>
                                            )}
                                            {i === 4 && (
                                                <div className="bg-orange-100 text-orange-700 text-xs p-2 rounded mb-2 font-medium border-l-4 border-orange-500">
                                                    Müşteri Görüşmesi
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-10 border-y border-slate-100 bg-slate-50/50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">
                        Modern ekiplerin tercihi
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['IndieHackers', 'ProductHunt', 'HackerNews', 'Twitter', 'GitHub'].map((brand) => (
                            <span key={brand} className="text-xl font-bold text-slate-800">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid (Bento Style) */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">İhtiyacınız Olan Her Şey</h2>
                        <p className="text-lg text-slate-600">
                            Orti, gereksiz özelliklerden arındırılmış, sadece işinize odaklanmanızı sağlayan araçlar sunar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="col-span-1 md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Gerçek Zamanlı Senkronizasyon</h3>
                                <p className="text-slate-600 max-w-md">
                                    Siz bir etkinlik eklediğinizde, ortağınızın ekranında anında belirir.
                                    Sayfa yenilemeye gerek yok. Supabase Realtime teknolojisi ile milisaniyeler içinde güncel kalın.
                                </p>
                            </div>
                            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Güvenli & Özel</h3>
                                <p className="text-slate-300">
                                    Davet kodu sistemi ile takvimlerinize sadece istediğiniz kişiler erişebilir.
                                </p>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/50"
                        >
                            <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Hızlı Kurulum</h3>
                            <p className="text-slate-600">
                                Google ile giriş yapın, takvim oluşturun ve kodu paylaşın. Sadece 30 saniye.
                            </p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="col-span-1 md:col-span-2 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 border border-violet-100"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6">
                                        <Globe className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Her Yerden Erişim</h3>
                                    <p className="text-slate-600">
                                        İster ofiste, ister evde, ister yolda. Orti tüm cihazlarınızda sorunsuz çalışır.
                                        Responsive tasarımı ile mobil deneyimi masaüstü kadar güçlüdür.
                                    </p>
                                </div>
                                <div className="flex-1 bg-white rounded-xl p-4 shadow-sm rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3 mb-3 border-b pb-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                                        <div>
                                            <div className="h-2 w-20 bg-slate-200 rounded mb-1" />
                                            <div className="h-2 w-12 bg-slate-100 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-8 bg-violet-100 rounded w-full" />
                                        <div className="h-8 bg-slate-50 rounded w-3/4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Nasıl Çalışır?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10" />

                        {[
                            {
                                step: "01",
                                title: "Hesap Oluştur",
                                desc: "Google hesabınızla saniyeler içinde giriş yapın."
                            },
                            {
                                step: "02",
                                title: "Takvim Kur",
                                desc: "Yeni bir takvim oluşturun ve size özel davet kodunu alın."
                            },
                            {
                                step: "03",
                                title: "Ortağını Davet Et",
                                desc: "Kodu ortağınla paylaş ve anında birlikte planlamaya başla."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                            >
                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 ring-4 ring-primary/20">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Planlamaya Başlamaya Hazır mısın?
                            </h2>
                            <p className="text-xl text-slate-300 mb-10">
                                Orti tamamen ücretsizdir. Kredi kartı gerekmez. Hemen şimdi ilk takvimini oluştur.
                            </p>
                            <Link href="/login">
                                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100">
                                    Ücretsiz Başla
                                </Button>
                            </Link>
                            <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> 14 gün deneme süresi yok, sonsuza kadar ücretsiz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold">Orti</span>
                        </div>
                        <div className="text-sm text-slate-500">
                            © 2024 Orti. Tüm hakları saklıdır.
                        </div>
                        <div className="flex gap-6">
                            <Link href="#" className="text-slate-500 hover:text-primary transition-colors">Gizlilik</Link>
                            <Link href="#" className="text-slate-500 hover:text-primary transition-colors">Kullanım Şartları</Link>
                            <Link href="#" className="text-slate-500 hover:text-primary transition-colors">İletişim</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
