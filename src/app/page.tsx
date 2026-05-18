"use client";

import { useState, useEffect, useRef } from "react";

interface ServiceType {
  id: number;
  serviceName: string;
  durationMinutes: number;
  price: number;
}

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 250;
      sliderRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{ time: string; booked: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoadingSlots(true);
      fetch(`/api/bookings?date=${selectedDate}&serviceId=${selectedService.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data.slots || []);
          setSelectedTime("");
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedService, selectedDate]);

  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    const cursorRing = document.getElementById("custom-cursor-ring");
    
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor && cursorRing) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top = e.clientY + "px";
      }
    };

    const handleMouseEnter = () => {
      if (cursorRing) {
        cursorRing.style.width = "36px";
        cursorRing.style.height = "36px";
        cursorRing.style.borderColor = "#E8E0D4";
      }
    };

    const handleMouseLeave = () => {
      if (cursorRing) {
        cursorRing.style.width = "24px";
        cursorRing.style.height = "24px";
        cursorRing.style.borderColor = "#b8934a";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    
    // Add hover listeners to interactables dynamically or statically
    const interactables = document.querySelectorAll("button, a, .group, select, input");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    // Hero animations
    setTimeout(() => {
      document.querySelectorAll(".hero-word").forEach((el) => el.classList.add("visible"));
      setTimeout(() => {
        document.querySelectorAll(".hero-sub-line").forEach((el) => el.classList.add("visible"));
      }, 400);
    }, 100);

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // Service row stagger observer
    const serviceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".service-row-hidden").forEach((row: Element, i) => {
            setTimeout(() => {
              row.classList.remove("service-row-hidden");
              row.classList.add("service-row-visible");
            }, i * 120);
          });
          serviceObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    const servicesSection = document.getElementById("services");
    if (servicesSection) serviceObserver.observe(servicesSection);

    // Parallax watermark
    const handleScroll = () => {
      const wm = document.querySelector(".watermark-text") as HTMLElement;
      if (wm) {
        wm.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [services]);

  const handleBookService = (service: ServiceType) => {
    setSelectedService(service);
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedService || !selectedDate || !selectedTime) return;
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, serviceId: selectedService.id, date: selectedDate, time: selectedTime }),
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 5000);
        setSelectedService(null);
        setSelectedDate("");
        setSelectedTime("");
        setName("");
        setPhone("");
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed due to an unexpected error.");
    }
  };

  return (
    <div className="selection:bg-primary selection:text-background">
      <svg className="film-grain">
        <filter id="grain">
          <feTurbulence baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" type="fractalNoise" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect filter="url(#grain)" width="100%" height="100%" />
      </svg>
      <div id="custom-cursor"></div>
      <div id="custom-cursor-ring"></div>

      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/90 backdrop-blur-md border-b border-primary/15">
        <div className="font-display-lg text-on-surface tracking-tighter uppercase text-[28px] tracking-[0.08em]">
          GL<span className="text-primary">◆</span>BAL
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="text-on-surface-variant font-label-caps text-[9px] tracking-widest hover:text-primary transition-colors duration-300" href="#">HERITAGE</a>
          <a className="text-on-surface-variant font-label-caps text-[9px] tracking-widest hover:text-primary transition-colors duration-300" href="#services">SERVICES</a>
          <a className="text-on-surface-variant font-label-caps text-[9px] tracking-widest hover:text-primary transition-colors duration-300" href="#gallery">GALLERY</a>
          <a className="text-on-surface-variant font-label-caps text-[9px] tracking-widest hover:text-primary transition-colors duration-300" href="#location">LOCATION</a>
          <a className="text-on-surface-variant font-label-caps text-[9px] tracking-widest hover:text-primary transition-colors duration-300" href="#contact">CONTACT</a>
        </nav>
        <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="bg-secondary text-on-secondary rounded-none px-6 py-2 font-label-caps text-[10px] tracking-widest hover:opacity-80 transition-all duration-300">
          BOOK NOW
        </button>
      </header>

      <main>
        {/* HERO */}
        <section className="h-screen relative flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-40 animate-slow-zoom" alt="Hero Background" src="/images/interior1.png" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B09]/80 via-[#0D0B09]/50 to-[#0D0B09]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-gutter max-w-5xl mt-16">
            <span className="font-label-caps text-primary mb-6 tracking-[0.4em] uppercase text-sm drop-shadow-md">— ISLAMABAD&apos;S EDITORIAL BARBER STUDIO</span>
            <h1 className="font-display-lg text-[64px] md:text-[96px] lg:text-[130px] text-on-surface leading-[0.9] mb-8 drop-shadow-lg uppercase">
              <span className="block hero-word" style={{ transitionDelay: "0.05s" }}>SCULPTING</span>
              <span className="block hero-word text-primary" style={{ transitionDelay: "0.2s" }}>PROFILES.</span>
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto mb-12 hero-sub-line text-2xl md:text-4xl lg:text-5xl font-light italic">
              Welcome to the new standard.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center hero-sub-line" style={{ transitionDelay: "0.5s" }}>
              <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="bg-primary text-background px-12 py-4 font-label-caps tracking-widest text-xs hover:bg-white transition-colors duration-300">
                BOOK APPOINTMENT
              </button>
              <a href="#services" className="text-on-surface hover:text-primary font-label-caps tracking-widest text-xs transition-colors duration-300 underline underline-offset-4 decoration-primary/30">
                DISCOVER OUR SERVICES
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 opacity-70">
            <span className="font-label-caps text-[10px] tracking-[0.5em] text-primary/60 uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent"></div>
          </div>
        </section>

        {/* MARQUEE SEPARATOR */}
        <div className="py-8 border-y border-primary/10 bg-[#120E0A] overflow-hidden flex whitespace-nowrap -mt-px relative z-20">
          <div className="animate-marquee flex gap-16 font-label-caps tracking-[0.4em] text-primary/40 text-[10px] md:text-xs">
            <span>SCULPTING PROFILES</span><span className="text-primary/20">◆</span>
            <span>ENGINEERED PRECISION</span><span className="text-primary/20">◆</span>
            <span>THE GENTLEMEN&apos;S SANCTUARY</span><span className="text-primary/20">◆</span>
            <span>RAW TEXTURE</span><span className="text-primary/20">◆</span>
            <span>SCULPTING PROFILES</span><span className="text-primary/20">◆</span>
            <span>ENGINEERED PRECISION</span><span className="text-primary/20">◆</span>
            <span>THE GENTLEMEN&apos;S SANCTUARY</span><span className="text-primary/20">◆</span>
            <span>RAW TEXTURE</span><span className="text-primary/20">◆</span>
            <span>SCULPTING PROFILES</span><span className="text-primary/20">◆</span>
            <span>ENGINEERED PRECISION</span><span className="text-primary/20">◆</span>
          </div>
        </div>

        {/* GALLERY */}
        <section className="py-section-padding reveal overflow-hidden relative" id="gallery">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-stack-lg border-b border-primary/20 pb-8 max-w-7xl mx-auto px-gutter">
            <div>
              <span className="font-label-caps text-primary mb-2 block">GALLERY NO. 01</span>
              <h2 className="font-headline-xl uppercase text-[48px] md:text-[64px]">Our Work.</h2>
            </div>
          </div>
          
          <div className="relative group/slider">
            <button onClick={() => scrollSlider('left')} className="absolute left-2 md:left-8 top-[calc(50%-24px)] -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary bg-[#0D0B09]/80 backdrop-blur-sm hover:bg-primary hover:text-background transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0" aria-label="Scroll left">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button onClick={() => scrollSlider('right')} className="absolute right-2 md:right-8 top-[calc(50%-24px)] -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary bg-[#0D0B09]/80 backdrop-blur-sm hover:bg-primary hover:text-background transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0" aria-label="Scroll right">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <div ref={sliderRef} className="flex overflow-x-auto gap-4 md:gap-6 pb-12 snap-x snap-mandatory px-gutter [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
            {[
              "Screenshot%202026-05-18%20184151.png",
              "Screenshot%202026-05-18%20184204.png",
              "Screenshot%202026-05-18%20184212.png",
              "Screenshot%202026-05-18%20184158.png",
              "Screenshot%202026-05-18%20184225.png",
              "Screenshot%202026-05-18%20184232.png",
              "Screenshot%202026-05-18%20184219.png",
              "interior1.png",
              "interior2.png",
              "interior3.png",
              "interior4.png"
            ].map((imgSrc, idx) => (
              <div key={idx} className="flex-none w-[65vw] md:w-[240px] lg:w-[260px] aspect-[4/5] snap-center rounded-xl overflow-hidden border border-primary/10 group bg-[#1C1510] relative">
                <img 
                  className="w-full h-full object-cover scale-[1.07] group-hover:scale-[1.12] transition-transform duration-700" 
                  alt={`Our Work ${idx + 1}`} 
                  src={`/images/${imgSrc}`} 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          </div>
        </section>
        <div className="copper-divider"></div>

        {/* SERVICES */}
        <section className="py-section-padding relative overflow-hidden reveal" id="services">
          <div className="watermark-text top-0 left-0">KAAM</div>
          <div className="max-w-7xl mx-auto px-gutter relative z-10">
            <div className="mb-stack-lg">
              <span className="font-label-caps text-primary mb-2 block">THE MENU</span>
              <h2 className="font-headline-xl uppercase">Services</h2>
            </div>
            <div className="space-y-0">
              {services.map((service, idx) => (
                <div key={service.id} className="group flex flex-col md:flex-row justify-between items-center py-10 border-b border-primary/10 transition-all duration-500 hover:-translate-x-4 cursor-default service-row-hidden">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 w-full md:w-auto">
                    <span className="font-label-caps text-primary/40">0{idx + 1}</span>
                    <h3 className="font-display-lg text-[40px] md:text-[64px] uppercase group-hover:text-primary transition-colors">{service.serviceName}</h3>
                    <span className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-[0.3em]">{service.durationMinutes} MINS</span>
                  </div>
                  <div className="flex items-center gap-12 w-full md:w-auto mt-6 md:mt-0">
                    <span className="font-label-caps text-body-lg text-primary">PKR {service.price}</span>
                    <button onClick={() => handleBookService(service)} className="bg-primary text-background px-8 py-3 font-label-caps text-[10px] tracking-widest hover:bg-white transition-colors">BOOK</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-[#161009] py-section-padding px-gutter border-t border-primary/10">
          <div className="max-w-7xl mx-auto mb-stack-lg">
            <span className="font-label-caps text-primary mb-2 block">TESTIMONIALS</span>
            <h2 className="font-headline-xl uppercase">Reviews</h2>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            <div className="relative">
              <span className="font-label-caps text-[64px] text-primary/10 absolute -top-8 -left-4">“</span>
              <blockquote className="font-body-lg text-[32px] italic leading-tight text-on-surface mb-8">
                The attention to detail at GL◆BAL is unmatched in the city. It’s not just a haircut; it’s a quiet hour of pure craftsmanship in an environment that commands respect.
              </blockquote>
              <cite className="font-label-caps text-primary not-italic tracking-widest">— AHMED KHAN</cite>
            </div>
            <div className="relative">
              <span className="font-label-caps text-[64px] text-primary/10 absolute -top-8 -left-4">“</span>
              <blockquote className="font-body-lg text-[32px] italic leading-tight text-on-surface mb-8">
                The aesthetic alone is worth the visit. But the precision of the skin fade and the traditional hot towel service is what keeps me coming back every two weeks.
              </blockquote>
              <cite className="font-label-caps text-primary not-italic tracking-widest">— ZAIN MALIK</cite>
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section className="py-section-padding px-gutter max-w-7xl mx-auto reveal" id="location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
            <div className="space-y-12">
              <div>
                <span className="font-label-caps text-primary mb-2 block">FIND US</span>
                <h2 className="font-headline-xl text-[48px] uppercase">Visit The House</h2>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <div className="font-body-md">
                    <span className="font-label-caps text-[10px] text-primary/60 block mb-1">ADDRESS</span>
                    Street 102, I-8/4, Islamabad, Pakistan
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <div className="font-body-md">
                    <span className="font-label-caps text-[10px] text-primary/60 block mb-1">CONTACT</span>
                    <a href="tel:+92512719405" className="text-primary hover:underline">+92 51 271 9405</a>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <div className="font-body-md">
                    <span className="font-label-caps text-[10px] text-primary/60 block mb-1">HOURS</span>
                    Mon – Sat · 9:00 AM – 10:00 PM<br />
                    Sunday · 10:00 AM – 8:00 PM
                  </div>
                </div>
              </div>
              <a href="https://maps.app.goo.gl/VbVcrJQ132Wo4tNg8?g_st=ic" target="_blank" rel="noopener noreferrer" className="border border-primary px-10 py-4 font-label-caps text-[12px] tracking-widest hover:bg-primary hover:text-background transition-all flex items-center gap-4 w-fit text-primary">
                GET DIRECTIONS <span className="material-symbols-outlined text-[16px]">north_east</span>
              </a>
              <div className="grid grid-cols-2 gap-4 pt-12">
                <div className="h-48 bg-[#1C1510] border border-primary/10 overflow-hidden relative group">
                  <span className="absolute top-2 left-2 z-10 font-label-caps text-[8px] bg-background/80 px-2 py-1 text-primary">EXTERIOR VIEW</span>
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Exterior" src="/images/exterior2.png" />
                </div>
                <div className="h-48 bg-[#1C1510] border border-primary/10 overflow-hidden relative group">
                  <span className="absolute top-2 left-2 z-10 font-label-caps text-[8px] bg-background/80 px-2 py-1 text-primary">EXTERIOR VIEW</span>
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Exterior" src="/images/exterior3.png" />
                </div>
              </div>
            </div>
            <div className="h-[600px] w-full border border-primary/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.8!2d73.0762167!3d33.6637666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df950077957027%3A0x391a53670c781726!2sGLOBAL%20Hair%20Saloon!5e0!3m2!1sen!2spk!4v1"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* BOOKING */}
        <section id="booking" className="py-section-padding px-gutter bg-[#0D0B09] border-t border-primary/20">
          <div className="max-w-7xl mx-auto border border-primary/20 p-12 relative">
            {bookingSuccess ? (
              <div className="text-center py-20">
                <h3 className="font-display-lg text-4xl text-primary mb-4">Booking Confirmed!</h3>
                <p className="font-body-md text-on-surface-variant">See you soon at GLOBAL Hair Saloon. We await your arrival.</p>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <h2 className="font-headline-xl uppercase text-[48px] mb-2">Claim Your Slot</h2>
                  <p className="font-label-caps text-[10px] tracking-[0.4em] text-primary/60 uppercase mb-12">Available timings</p>
                  <div className="space-y-8 mb-12">
                    <div>
                      <label className="font-label-caps text-primary block mb-2">SERVICE</label>
                      <select required className="w-full bg-[#1A140C] border border-primary/30 p-4 font-body-md outline-none focus:border-primary transition-colors appearance-none cursor-pointer" value={selectedService?.id || ""} onChange={(e) => setSelectedService(services.find((s) => s.id === parseInt(e.target.value)) || null)}>
                        <option value="" disabled>-- Select a Service --</option>
                        {services.map((s) => <option key={s.id} value={s.id}>{s.serviceName} ({s.durationMinutes}m)</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-label-caps text-primary block mb-2">DATE</label>
                      <input type="date" required disabled={!selectedService} min={new Date().toISOString().split("T")[0]} max={(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })()} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-[#1A140C] border border-primary/30 p-4 font-body-md outline-none focus:border-primary transition-colors disabled:opacity-50 [color-scheme:dark]" />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  {!selectedService || !selectedDate ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] border border-dashed border-primary/30 font-label-caps text-primary/50">CHOOSE SERVICE & DATE</div>
                  ) : loadingSlots ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] font-label-caps text-primary animate-pulse">FINDING AVAILABILITY...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[300px] bg-secondary/10 text-secondary font-label-caps">NO SLOTS AVAILABLE</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availableSlots.map((slot) => (
                        <button key={slot.time} type="button" disabled={slot.booked} onClick={() => setSelectedTime(slot.time)} className={`py-6 text-center transition-all border border-primary/20 group ${selectedTime === slot.time ? "bg-primary text-background" : slot.booked ? "bg-[#1A140C] opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-background"}`}>
                          <span className={`font-label-caps block text-lg ${slot.booked ? "line-through" : ""}`}>{slot.time}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedTime && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div>
                        <label className="font-label-caps text-primary block mb-2">YOUR NAME</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-[#1A140C] border border-primary/30 p-4 font-body-md outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="font-label-caps text-primary block mb-2">YOUR PHONE</label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" minLength={10} maxLength={15} pattern="^\+?[0-9\s\-]{10,15}$" title="Please enter a valid phone number (10-15 digits)" className="w-full bg-[#1A140C] border border-primary/30 p-4 font-body-md outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                  )}
                  <div className="mt-12">
                    <button type="submit" disabled={!selectedTime} className="w-full bg-secondary text-on-secondary font-label-caps py-6 tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {selectedTime ? `CONFIRM BOOKING FOR ${selectedTime}` : "SELECT A SLOT"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="w-full px-gutter py-section-padding flex flex-col md:flex-row justify-between items-end gap-stack-lg border-t border-primary/20 bg-surface-container-lowest">
        <div className="w-full md:w-auto">
          <div className="font-display-lg text-on-surface tracking-tighter mb-8 text-[56px] tracking-[0.06em]">
            GL<span className="text-primary">◆</span>BAL
          </div>
          <div className="space-y-2">
            <p className="font-label-caps text-on-surface-variant">HUNAR · ISLAMABAD</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-8 w-full md:w-auto">
          <nav className="flex gap-12 items-center">
            <a href="/admin" className="text-on-surface-variant/20 hover:text-on-surface-variant font-label-caps text-[8px] transition-colors">ADMIN</a>
          </nav>
          <div className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-[0.2em] flex items-center gap-8">
            © 2024 GLOBAL HAIR SALOON. ISLAMABAD.
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all">
              <span className="material-symbols-outlined text-[16px]">north</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
